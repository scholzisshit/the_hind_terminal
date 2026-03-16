use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use chrono::Utc;
use dashmap::DashMap;
use futures_util::{SinkExt, StreamExt};
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::{
    net::SocketAddr,
    sync::Arc,
    time::Duration,
};
use tokio::sync::broadcast;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

// ─────────────────────────────────────────
//  DATA TYPES
// ─────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
struct TickerData {
    symbol: String,
    value: f64,
    change: f64,
    change_pct: f64,
    timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct HighwayTelemetry {
    id: String,
    name: String,
    congestion_index: f64,
    avg_speed_kmh: f64,
    incidents: u32,
    status: String,
    timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct InfraAlert {
    id: String,
    severity: String,
    category: String,
    message: String,
    region: String,
    lat: f64,
    lng: f64,
    timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct GridStatus {
    region_id: String,
    region_name: String,
    load_pct: f64,
    saturation_prob: f64,
    risk_level: String,
    timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct TelemetryFrame {
    #[serde(rename = "type")]
    frame_type: String,
    sequence: u64,
    sensex: TickerData,
    nifty: TickerData,
    bank_nifty: TickerData,
    highways: Vec<HighwayTelemetry>,
    grids: Vec<GridStatus>,
    alerts: Vec<InfraAlert>,
    connected_clients: usize,
    timestamp: String,
}

// ─────────────────────────────────────────
//  APP STATE
// ─────────────────────────────────────────

#[derive(Clone)]
struct AppState {
    broadcaster: broadcast::Sender<String>,
    client_count: Arc<std::sync::atomic::AtomicUsize>,
    cache: Arc<DashMap<String, String>>,
}

// ─────────────────────────────────────────
//  DATA GENERATORS (pure Rust, sub-μs)
// ─────────────────────────────────────────

fn now_iso() -> String {
    Utc::now().to_rfc3339()
}

fn gen_sensex(seq: u64) -> TickerData {
    let mut rng = rand::thread_rng();
    let period = (seq as f64 * 0.05).sin();
    let value = 72_000.0 + period * 1_200.0 + rng.gen_range(-150.0..150.0);
    let change: f64 = rng.gen_range(-280.0..320.0);
    TickerData {
        symbol: "SENSEX".into(),
        value: (value * 100.0).round() / 100.0,
        change: (change * 100.0).round() / 100.0,
        change_pct: (change / value * 100.0 * 1000.0).round() / 1000.0,
        timestamp: now_iso(),
    }
}

fn gen_nifty(seq: u64) -> TickerData {
    let mut rng = rand::thread_rng();
    let period = (seq as f64 * 0.048).sin();
    let value = 21_800.0 + period * 380.0 + rng.gen_range(-45.0..45.0);
    let change: f64 = rng.gen_range(-85.0..98.0);
    TickerData {
        symbol: "NIFTY50".into(),
        value: (value * 100.0).round() / 100.0,
        change: (change * 100.0).round() / 100.0,
        change_pct: (change / value * 100.0 * 1000.0).round() / 1000.0,
        timestamp: now_iso(),
    }
}

fn gen_bank_nifty(seq: u64) -> TickerData {
    let mut rng = rand::thread_rng();
    let period = (seq as f64 * 0.052).cos();
    let value = 46_500.0 + period * 900.0 + rng.gen_range(-120.0..120.0);
    let change: f64 = rng.gen_range(-180.0..210.0);
    TickerData {
        symbol: "BANKNIFTY".into(),
        value: (value * 100.0).round() / 100.0,
        change: (change * 100.0).round() / 100.0,
        change_pct: (change / value * 100.0 * 1000.0).round() / 1000.0,
        timestamp: now_iso(),
    }
}

fn gen_highways(seq: u64) -> Vec<HighwayTelemetry> {
    let mut rng = rand::thread_rng();
    let highways = vec![
        ("NH-44", "NH-44 Srinagar–Kanyakumari", 77.59, 12.97),
        ("NH-48", "NH-48 Delhi–Chennai", 77.10, 28.70),
        ("NH-19", "NH-19 Delhi–Kolkata", 88.36, 22.57),
        ("NH-27", "NH-27 East–West Corridor", 74.79, 26.89),
        ("NH-16", "NH-16 Kolkata–Chennai", 80.27, 13.08),
    ];
    highways
        .iter()
        .map(|(id, name, lng, lat)| {
            let congestion = (0.5 + 0.3 * ((seq as f64 * 0.03 + lng).sin()))
                .clamp(0.1, 0.98)
                + rng.gen_range(-0.05..0.05);
            let congestion = congestion.clamp(0.1, 0.98);
            let speed = 120.0 * (1.0 - congestion * 0.72);
            let status = if congestion > 0.8 {
                "CRITICAL"
            } else if congestion > 0.6 {
                "HIGH"
            } else if congestion > 0.4 {
                "MODERATE"
            } else {
                "CLEAR"
            };
            HighwayTelemetry {
                id: id.to_string(),
                name: name.to_string(),
                congestion_index: (congestion * 1000.0).round() / 1000.0,
                avg_speed_kmh: (speed * 10.0).round() / 10.0,
                incidents: rng.gen_range(0..6),
                status: status.to_string(),
                timestamp: now_iso(),
            }
        })
        .collect()
}

fn gen_grids() -> Vec<GridStatus> {
    let mut rng = rand::thread_rng();
    let regions = vec![
        ("WR", "Western Region"),
        ("NR", "Northern Region"),
        ("SR", "Southern Region"),
        ("ER", "Eastern Region"),
        ("NER", "North-Eastern Region"),
    ];
    regions
        .iter()
        .map(|(id, name)| {
            let load = rng.gen_range(62.0..97.0_f64);
            let sat_prob = ((load - 70.0) * 3.33).max(0.0).min(100.0);
            let risk = if sat_prob > 85.0 {
                "CRITICAL"
            } else if sat_prob > 60.0 {
                "HIGH"
            } else if sat_prob > 35.0 {
                "MODERATE"
            } else {
                "LOW"
            };
            GridStatus {
                region_id: id.to_string(),
                region_name: name.to_string(),
                load_pct: (load * 10.0).round() / 10.0,
                saturation_prob: (sat_prob * 10.0).round() / 10.0,
                risk_level: risk.to_string(),
                timestamp: now_iso(),
            }
        })
        .collect()
}

fn gen_alerts(seq: u64) -> Vec<InfraAlert> {
    let mut rng = rand::thread_rng();
    let alert_pool = vec![
        ("CRITICAL", "POWER", "Grid load at 94% — Maharashtra Western Region", "Maharashtra", 19.076, 72.877),
        ("WARNING", "AQI", "PM2.5 spike 312 μg/m³ — Delhi NCR", "Delhi", 28.704, 77.102),
        ("ALERT", "TRAFFIC", "Major congestion on NH-44 near Nagpur", "Maharashtra", 21.145, 79.088),
        ("INFO", "WEB3", "Web3 node density +34% in Bengaluru tech corridor", "Karnataka", 12.971, 77.594),
        ("CRITICAL", "CLOUD", "AWS ap-south-1 latency +180ms — Mumbai AZ-b", "Maharashtra", 19.076, 72.877),
        ("WARNING", "CLIMATE", "Monsoon vector 15° north of forecast — Bay of Bengal", "Odisha", 20.296, 85.824),
        ("ALERT", "TECH", "500 new hackathon registrations — IIT Bombay CTF", "Maharashtra", 19.133, 72.913),
        ("INFO", "FINANCE", "Sensex breaches 72,500 — intraday high", "Maharashtra", 18.938, 72.835),
        ("WARNING", "POWER", "Grid frequency deviation 49.7 Hz — Southern Region", "Tamil Nadu", 13.082, 80.270),
        ("CRITICAL", "INFRA", "Railway signal anomaly — Delhi–Mumbai rail corridor", "Maharashtra", 21.145, 79.088),
    ];
    let count = rng.gen_range(2..5usize);
    let mut alerts = Vec::new();
    for i in 0..count {
        let idx = ((seq as usize + i * 3) + rng.gen_range(0..3)) % alert_pool.len();
        let (sev, cat, msg, region, lat, lng) = alert_pool[idx];
        alerts.push(InfraAlert {
            id: format!("ALT-{}-{}", seq, i),
            severity: sev.to_string(),
            category: cat.to_string(),
            message: msg.to_string(),
            region: region.to_string(),
            lat,
            lng,
            timestamp: now_iso(),
        });
    }
    alerts
}

// ─────────────────────────────────────────
//  TELEMETRY BROADCAST LOOP
// ─────────────────────────────────────────

async fn telemetry_loop(state: AppState) {
    let mut seq: u64 = 0;
    let mut interval = tokio::time::interval(Duration::from_millis(1000)); // 1 Hz — Relaxed Pace

    loop {
        interval.tick().await;
        seq += 1;

        let frame = TelemetryFrame {
            frame_type: "telemetry".into(),
            sequence: seq,
            sensex: gen_sensex(seq),
            nifty: gen_nifty(seq),
            bank_nifty: gen_bank_nifty(seq),
            highways: gen_highways(seq),
            grids: gen_grids(),
            alerts: if seq % 8 == 0 { gen_alerts(seq) } else { vec![] },
            connected_clients: state.client_count.load(std::sync::atomic::Ordering::Relaxed),
            timestamp: now_iso(),
        };

        if let Ok(json) = serde_json::to_string(&frame) {
            state.cache.insert("latest_frame".into(), json.clone());
            let _ = state.broadcaster.send(json);
        }
    }
}

// ─────────────────────────────────────────
//  HANDLERS
// ─────────────────────────────────────────

async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(socket: WebSocket, state: AppState) {
    let client_id = uuid::Uuid::new_v4();
    let count = state
        .client_count
        .fetch_add(1, std::sync::atomic::Ordering::Relaxed)
        + 1;
    tracing::info!("Client {client_id} connected. Total: {count}");

    let mut rx = state.broadcaster.subscribe();
    let (mut sender, mut receiver) = socket.split();

    // Send latest cached frame immediately
    if let Some(latest) = state.cache.get("latest_frame") {
        let _ = sender.send(Message::Text(latest.clone())).await;
    }

    let send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    // Drain incoming messages (ping/pong handled by axum)
    while let Some(Ok(msg)) = receiver.next().await {
        if let Message::Close(_) = msg {
            break;
        }
    }

    send_task.abort();
    state
        .client_count
        .fetch_sub(1, std::sync::atomic::Ordering::Relaxed);
    tracing::info!("Client {client_id} disconnected.");
}

async fn health_handler() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "operational",
        "service": "bharat-core",
        "version": "1.0.0",
        "timestamp": now_iso(),
    }))
}

async fn stats_handler(State(state): State<AppState>) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "connected_clients": state.client_count.load(std::sync::atomic::Ordering::Relaxed),
        "timestamp": now_iso(),
    }))
}

// ─────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "bharat_core=info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let (tx, _rx) = broadcast::channel::<String>(4096);
    let state = AppState {
        broadcaster: tx,
        client_count: Arc::new(std::sync::atomic::AtomicUsize::new(0)),
        cache: Arc::new(DashMap::new()),
    };

    // Spawn telemetry broadcast loop
    tokio::spawn(telemetry_loop(state.clone()));

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/ws/live", get(ws_handler))
        .route("/health", get(health_handler))
        .route("/stats", get(stats_handler))
        .layer(cors)
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("bharat-core listening on {addr}");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
