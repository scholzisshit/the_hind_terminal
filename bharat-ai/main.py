"""
Bharat Monitor — AI/Data Pipeline
FastAPI server on port 8000
Generates and serves high-fidelity mock data for all Indian intelligence layers.
"""

import asyncio
import json
import math
import random
import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Bharat Monitor AI Pipeline", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
#  DATA GENERATORS
# ─────────────────────────────────────────

INDIA_CITIES = [
    {"name": "Mumbai", "lat": 19.0760, "lng": 72.8777, "state": "Maharashtra", "tier": 1},
    {"name": "Delhi", "lat": 28.7041, "lng": 77.1025, "state": "Delhi", "tier": 1},
    {"name": "Bengaluru", "lat": 12.9716, "lng": 77.5946, "state": "Karnataka", "tier": 1},
    {"name": "Hyderabad", "lat": 17.3850, "lng": 78.4867, "state": "Telangana", "tier": 1},
    {"name": "Chennai", "lat": 13.0827, "lng": 80.2707, "state": "Tamil Nadu", "tier": 1},
    {"name": "Pune", "lat": 18.5204, "lng": 73.8567, "state": "Maharashtra", "tier": 1},
    {"name": "Kolkata", "lat": 22.5726, "lng": 88.3639, "state": "West Bengal", "tier": 1},
    {"name": "Ahmedabad", "lat": 23.0225, "lng": 72.5714, "state": "Gujarat", "tier": 1},
    {"name": "Jaipur", "lat": 26.9124, "lng": 75.7873, "state": "Rajasthan", "tier": 2},
    {"name": "Lucknow", "lat": 26.8467, "lng": 80.9462, "state": "Uttar Pradesh", "tier": 2},
    {"name": "Chandigarh", "lat": 30.7333, "lng": 76.7794, "state": "Punjab", "tier": 2},
    {"name": "Bhubaneswar", "lat": 20.2961, "lng": 85.8245, "state": "Odisha", "tier": 2},
    {"name": "Kochi", "lat": 9.9312, "lng": 76.2673, "state": "Kerala", "tier": 2},
    {"name": "Indore", "lat": 22.7196, "lng": 75.8577, "state": "Madhya Pradesh", "tier": 2},
    {"name": "Nagpur", "lat": 21.1458, "lng": 79.0882, "state": "Maharashtra", "tier": 2},
    {"name": "Surat", "lat": 21.1702, "lng": 72.8311, "state": "Gujarat", "tier": 2},
    {"name": "Visakhapatnam", "lat": 17.6868, "lng": 83.2185, "state": "Andhra Pradesh", "tier": 2},
    {"name": "Coimbatore", "lat": 11.0168, "lng": 76.9558, "state": "Tamil Nadu", "tier": 2},
    {"name": "Patna", "lat": 25.5941, "lng": 85.1376, "state": "Bihar", "tier": 2},
    {"name": "Guwahati", "lat": 26.1445, "lng": 91.7362, "state": "Assam", "tier": 2},
]

UNIVERSITIES = [
    {"name": "IIT Bombay", "lat": 19.1334, "lng": 72.9133, "city": "Mumbai"},
    {"name": "IIT Delhi", "lat": 28.5450, "lng": 77.1926, "city": "Delhi"},
    {"name": "IISc Bangalore", "lat": 13.0212, "lng": 77.5680, "city": "Bengaluru"},
    {"name": "IIT Madras", "lat": 12.9915, "lng": 80.2337, "city": "Chennai"},
    {"name": "IIT Kharagpur", "lat": 22.3149, "lng": 87.3105, "city": "Kharagpur"},
    {"name": "BITS Pilani", "lat": 28.3665, "lng": 73.6749, "city": "Pilani"},
    {"name": "NIT Surathkal", "lat": 13.0109, "lng": 74.7948, "city": "Mangaluru"},
    {"name": "IIT Hyderabad", "lat": 17.5937, "lng": 78.1299, "city": "Hyderabad"},
    {"name": "IIIT Hyderabad", "lat": 17.4459, "lng": 78.3487, "city": "Hyderabad"},
    {"name": "Jadavpur University", "lat": 22.4996, "lng": 88.3712, "city": "Kolkata"},
]

HIGHWAYS = [
    {"id": "NH-44", "name": "NH-44 (Srinagar-Kanyakumari)", "checkpoints": [
        {"lat": 34.09, "lng": 74.79}, {"lat": 28.70, "lng": 77.10},
        {"lat": 23.02, "lng": 72.57}, {"lat": 12.97, "lng": 77.59},
        {"lat": 8.08, "lng": 77.55}
    ]},
    {"id": "NH-48", "name": "NH-48 (Delhi-Chennai)", "checkpoints": [
        {"lat": 28.70, "lng": 77.10}, {"lat": 22.72, "lng": 75.86},
        {"lat": 17.39, "lng": 78.49}, {"lat": 13.08, "lng": 80.27}
    ]},
    {"id": "NH-19", "name": "NH-19 (Delhi-Kolkata)", "checkpoints": [
        {"lat": 28.70, "lng": 77.10}, {"lat": 25.59, "lng": 85.14},
        {"lat": 22.57, "lng": 88.36}
    ]},
]

POWER_GRIDS = [
    {"id": "WR", "name": "Western Region", "states": ["Maharashtra", "Gujarat", "MP", "Chhattisgarh"], "capacity_mw": 85000},
    {"id": "NR", "name": "Northern Region", "states": ["Delhi", "UP", "Haryana", "Punjab", "Rajasthan"], "capacity_mw": 92000},
    {"id": "SR", "name": "Southern Region", "states": ["Karnataka", "Tamil Nadu", "Telangana", "Andhra", "Kerala"], "capacity_mw": 78000},
    {"id": "ER", "name": "Eastern Region", "states": ["West Bengal", "Bihar", "Jharkhand", "Odisha"], "capacity_mw": 65000},
    {"id": "NER", "name": "North-Eastern Region", "states": ["Assam", "Meghalaya", "Manipur"], "capacity_mw": 12000},
]

AQI_CITIES = [c for c in INDIA_CITIES if c["tier"] == 1]

WEB3_HUB_EVENTS = [
    "New DeFi protocol deployed", "NFT marketplace launched", "DAO governance vote",
    "Cross-chain bridge activated", "Smart contract audit completed", "Web3 startup funded",
    "Blockchain node synced", "Crypto exchange listed new token", "L2 scaling solution deployed",
]

HACKATHON_THEMES = [
    "AI/ML Hackathon", "Blockchain CTF", "Cybersecurity Capture The Flag",
    "Open Source Sprint", "FinTech Hack", "GovTech Challenge", "Space Tech Hackathon",
    "Climate Tech Hack", "Health Tech Sprint", "Smart Cities Challenge",
]

ALERT_TEMPLATES = [
    "Critical: Power grid load at {val}% in {state}",
    "Warning: AQI spike to {val} in {city}",
    "Alert: Highway congestion index {val} on {highway}",
    "Info: Web3 node density +{val}% in {city}",
    "Critical: AWS ap-south-1 latency spike +{val}ms",
    "Warning: Monsoon vector shifted {val}° east of forecast",
    "Alert: Hackathon registration surge at {city} ({val} teams)",
    "Info: New tech unicorn valued at ${val}M in Bengaluru",
    "Critical: Railway signal anomaly on {city} corridor",
    "Warning: River basin level at {val}% capacity in {state}",
]

# ─────────────────────────────────────────
#  REAL-TIME DATA FUNCTIONS
# ─────────────────────────────────────────

def get_timestamp() -> str:
    return datetime.utcnow().isoformat() + "Z"

def noise(base: float, pct: float = 0.05) -> float:
    return base * (1 + random.uniform(-pct, pct))

def generate_sensex() -> Dict:
    base = 72000 + math.sin(time.time() / 60) * 1500
    return {
        "value": round(noise(base, 0.003), 2),
        "change": round(random.uniform(-250, 300), 2),
        "change_pct": round(random.uniform(-0.35, 0.42), 3),
        "timestamp": get_timestamp(),
    }

def generate_nifty() -> Dict:
    base = 21800 + math.sin(time.time() / 55) * 450
    return {
        "value": round(noise(base, 0.003), 2),
        "change": round(random.uniform(-80, 95), 2),
        "change_pct": round(random.uniform(-0.37, 0.44), 3),
        "timestamp": get_timestamp(),
    }

def generate_aqi_data() -> List[Dict]:
    result = []
    for city in INDIA_CITIES[:12]:
        # Simulate AQI with time-based variation
        hour = datetime.utcnow().hour
        base_aqi = {"Mumbai": 145, "Delhi": 312, "Bengaluru": 89, "Hyderabad": 102,
                    "Chennai": 78, "Pune": 118, "Kolkata": 198, "Ahmedabad": 167}.get(city["name"], 120)
        aqi = int(noise(base_aqi, 0.15))
        result.append({
            "city": city["name"],
            "lat": city["lat"],
            "lng": city["lng"],
            "aqi": aqi,
            "level": "Hazardous" if aqi > 300 else "Very Unhealthy" if aqi > 200 else "Unhealthy" if aqi > 150 else "Moderate" if aqi > 100 else "Good",
            "pm25": round(aqi * 0.42, 1),
            "pm10": round(aqi * 0.68, 1),
            "timestamp": get_timestamp(),
        })
    return result

def generate_grid_predictions() -> List[Dict]:
    result = []
    for grid in POWER_GRIDS:
        load_pct = round(random.uniform(65, 98), 1)
        saturation_prob = max(0, min(100, (load_pct - 70) * 3.33))
        result.append({
            "region": grid["name"],
            "region_id": grid["id"],
            "states": grid["states"],
            "capacity_mw": grid["capacity_mw"],
            "current_load_pct": load_pct,
            "saturation_probability": round(saturation_prob, 1),
            "prediction": f"{int(saturation_prob)}% probability of power grid saturation in {grid['states'][0]}",
            "risk_level": "CRITICAL" if saturation_prob > 85 else "HIGH" if saturation_prob > 60 else "MODERATE" if saturation_prob > 35 else "LOW",
            "timestamp": get_timestamp(),
        })
    return result

def generate_web3_hubs() -> List[Dict]:
    result = []
    for city in INDIA_CITIES:
        if city["tier"] == 1 or random.random() > 0.4:
            density = random.randint(20, 200) if city["tier"] == 1 else random.randint(5, 50)
            result.append({
                "city": city["name"],
                "state": city["state"],
                "lat": city["lat"] + random.uniform(-0.05, 0.05),
                "lng": city["lng"] + random.uniform(-0.05, 0.05),
                "node_count": density,
                "active_protocols": random.randint(3, 25),
                "daily_txns": random.randint(1000, 50000),
                "latest_event": random.choice(WEB3_HUB_EVENTS),
                "timestamp": get_timestamp(),
            })
    return result

def generate_hackathon_heatmap() -> List[Dict]:
    result = []
    for uni in UNIVERSITIES:
        if random.random() > 0.3:
            result.append({
                "university": uni["name"],
                "city": uni["city"],
                "lat": uni["lat"] + random.uniform(-0.01, 0.01),
                "lng": uni["lng"] + random.uniform(-0.01, 0.01),
                "event": random.choice(HACKATHON_THEMES),
                "teams": random.randint(20, 300),
                "participants": random.randint(100, 1500),
                "prize_pool": random.randint(50000, 2000000),
                "status": random.choice(["LIVE", "UPCOMING", "COMPLETED"]),
                "intensity": random.uniform(0.3, 1.0),
                "timestamp": get_timestamp(),
            })
    return result

def generate_monsoon_vectors() -> List[Dict]:
    base_lat = 8.5 + (datetime.utcnow().month - 6) * 2.5
    vectors = []
    for i in range(8):
        lng = 72 + i * 3
        vectors.append({
            "lat": base_lat + random.uniform(-1, 1),
            "lng": lng,
            "direction_deg": random.uniform(315, 360),
            "speed_kmh": random.uniform(15, 45),
            "intensity": random.choice(["Light", "Moderate", "Heavy", "Very Heavy"]),
            "rainfall_mm": round(random.uniform(5, 120), 1),
        })
    return vectors

def generate_highway_traffic() -> List[Dict]:
    result = []
    for hw in HIGHWAYS:
        congestion = round(random.uniform(0.2, 0.95), 2)
        result.append({
            "id": hw["id"],
            "name": hw["name"],
            "congestion_index": congestion,
            "avg_speed_kmh": round(120 * (1 - congestion * 0.7), 1),
            "incidents": random.randint(0, 5),
            "checkpoints": hw["checkpoints"],
            "status": "CRITICAL" if congestion > 0.8 else "HIGH" if congestion > 0.6 else "MODERATE" if congestion > 0.4 else "CLEAR",
            "timestamp": get_timestamp(),
        })
    return result

def generate_live_alerts() -> List[Dict]:
    alerts = []
    for _ in range(random.randint(3, 8)):
        template = random.choice(ALERT_TEMPLATES)
        city = random.choice(INDIA_CITIES)
        highway = random.choice(HIGHWAYS)
        state = random.choice(["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "Rajasthan", "UP"])
        alert = template.format(
            val=random.randint(10, 999),
            state=state,
            city=city["name"],
            highway=highway["id"],
        )
        severity = random.choice(["CRITICAL", "WARNING", "INFO", "ALERT"])
        alerts.append({
            "id": f"alert_{int(time.time() * 1000)}_{random.randint(1000, 9999)}",
            "message": alert,
            "severity": severity,
            "category": random.choice(["POWER", "AQI", "TRAFFIC", "WEB3", "CLOUD", "CLIMATE", "TECH"]),
            "lat": city["lat"],
            "lng": city["lng"],
            "timestamp": get_timestamp(),
        })
    return alerts

def generate_financial_series(points: int = 60) -> Dict:
    now = time.time()
    sensex_series = []
    nifty_series = []
    base_s = 72000
    base_n = 21800
    for i in range(points):
        t = now - (points - i) * 60
        s_val = base_s + math.sin(t / 300) * 1200 + random.uniform(-200, 200)
        n_val = base_n + math.sin(t / 280) * 360 + random.uniform(-60, 60)
        sensex_series.append({"t": int(t), "v": round(s_val, 2)})
        nifty_series.append({"t": int(t), "v": round(n_val, 2)})
    return {
        "sensex": sensex_series,
        "nifty": nifty_series,
        "latest_sensex": sensex_series[-1]["v"],
        "latest_nifty": nifty_series[-1]["v"],
    }

# ─────────────────────────────────────────
#  REST ENDPOINTS
# ─────────────────────────────────────────

@app.get("/")
def root():
    return {"service": "Bharat Monitor AI Pipeline", "status": "operational", "version": "1.0.0"}

@app.get("/api/aqi")
def get_aqi():
    return {"data": generate_aqi_data(), "timestamp": get_timestamp()}

@app.get("/api/grid-predictions")
def get_grid_predictions():
    return {"data": generate_grid_predictions(), "timestamp": get_timestamp()}

@app.get("/api/web3-hubs")
def get_web3_hubs():
    return {"data": generate_web3_hubs(), "timestamp": get_timestamp()}

@app.get("/api/hackathon-heatmap")
def get_hackathon_heatmap():
    return {"data": generate_hackathon_heatmap(), "timestamp": get_timestamp()}

@app.get("/api/monsoon")
def get_monsoon():
    return {"data": generate_monsoon_vectors(), "timestamp": get_timestamp()}

@app.get("/api/highway-traffic")
def get_highway_traffic():
    return {"data": generate_highway_traffic(), "timestamp": get_timestamp()}

@app.get("/api/alerts")
def get_alerts():
    return {"data": generate_live_alerts(), "timestamp": get_timestamp()}

@app.get("/api/financial")
def get_financial():
    return generate_financial_series(60)

@app.get("/api/snapshot")
def get_snapshot():
    """Full data snapshot for initial load"""
    return {
        "aqi": generate_aqi_data(),
        "grid": generate_grid_predictions(),
        "web3": generate_web3_hubs(),
        "hackathons": generate_hackathon_heatmap(),
        "monsoon": generate_monsoon_vectors(),
        "highways": generate_highway_traffic(),
        "alerts": generate_live_alerts(),
        "financial": generate_financial_series(60),
        "sensex": generate_sensex(),
        "nifty": generate_nifty(),
        "timestamp": get_timestamp(),
    }

# ─────────────────────────────────────────
#  WEBSOCKET — AI STREAM
# ─────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active_connections.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active_connections:
            self.active_connections.remove(ws)

    async def broadcast(self, data: str):
        dead = []
        for conn in self.active_connections:
            try:
                await conn.send_text(data)
            except Exception:
                dead.append(conn)
        for d in dead:
            self.active_connections.remove(d)

manager = ConnectionManager()

@app.websocket("/ws/ai-stream")
async def ai_stream(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            payload = {
                "type": "ai_update",
                "sensex": generate_sensex(),
                "nifty": generate_nifty(),
                "alerts": generate_live_alerts(),
                "grid": generate_grid_predictions(),
                "aqi": generate_aqi_data(),
                "highways": generate_highway_traffic(),
                "timestamp": get_timestamp(),
            }
            await ws.send_text(json.dumps(payload))
            await asyncio.sleep(1.5)
    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception:
        manager.disconnect(ws)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False, log_level="info")
