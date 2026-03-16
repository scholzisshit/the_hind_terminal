"use client";
import { useEffect, useRef, useState, useCallback } from "react";

export interface TelemetryFrame {
  type: string;
  sequence: number;
  sensex: { symbol: string; value: number; change: number; change_pct: number; timestamp: string };
  nifty: { symbol: string; value: number; change: number; change_pct: number; timestamp: string };
  bank_nifty: { symbol: string; value: number; change: number; change_pct: number; timestamp: string };
  highways: Array<{ id: string; name: string; congestion_index: number; avg_speed_kmh: number; incidents: number; status: string }>;
  grids: Array<{ region_id: string; region_name: string; load_pct: number; saturation_prob: number; risk_level: string }>;
  alerts: Array<{ id: string; severity: string; category: string; message: string; region: string; lat: number; lng: number; timestamp: string }>;
  connected_clients: number;
  timestamp: string;
}

const WS_URL = "ws://localhost:8080/ws/live";
const RECONNECT_DELAY = 2000;
const HISTORY_MAX = 120;

function generateFallback(seq: number): TelemetryFrame {
  const t = Date.now();
  const sin = Math.sin(seq * 0.05);
  return {
    type: "telemetry", sequence: seq,
    sensex: { symbol: "SENSEX", value: +(72000 + sin * 1200 + (Math.random() - 0.5) * 200).toFixed(2), change: +(Math.random() * 400 - 200).toFixed(2), change_pct: +(Math.random() * 0.8 - 0.4).toFixed(3), timestamp: new Date().toISOString() },
    nifty: { symbol: "NIFTY50", value: +(21800 + sin * 380 + (Math.random() - 0.5) * 60).toFixed(2), change: +(Math.random() * 120 - 60).toFixed(2), change_pct: +(Math.random() * 0.6 - 0.3).toFixed(3), timestamp: new Date().toISOString() },
    bank_nifty: { symbol: "BANKNIFTY", value: +(46500 + Math.cos(seq * 0.052) * 900 + (Math.random() - 0.5) * 150).toFixed(2), change: +(Math.random() * 300 - 150).toFixed(2), change_pct: +(Math.random() * 0.7 - 0.35).toFixed(3), timestamp: new Date().toISOString() },
    highways: [
      { id: "NH-44", name: "NH-44 Srinagar–Kanyakumari", congestion_index: +(0.3 + Math.random() * 0.6).toFixed(3), avg_speed_kmh: +(60 + Math.random() * 50).toFixed(1), incidents: Math.floor(Math.random() * 4), status: ["CLEAR","MODERATE","HIGH","CRITICAL"][Math.floor(Math.random()*4)] },
      { id: "NH-48", name: "NH-48 Delhi–Chennai", congestion_index: +(0.3 + Math.random() * 0.6).toFixed(3), avg_speed_kmh: +(55 + Math.random() * 55).toFixed(1), incidents: Math.floor(Math.random() * 3), status: ["CLEAR","MODERATE","HIGH"][Math.floor(Math.random()*3)] },
      { id: "NH-19", name: "NH-19 Delhi–Kolkata", congestion_index: +(0.2 + Math.random() * 0.5).toFixed(3), avg_speed_kmh: +(65 + Math.random() * 45).toFixed(1), incidents: Math.floor(Math.random() * 2), status: ["CLEAR","MODERATE","HIGH"][Math.floor(Math.random()*3)] },
    ],
    grids: [
      { region_id: "WR", region_name: "Western Region", load_pct: +(65 + Math.random() * 30).toFixed(1), saturation_prob: +(Math.random() * 80).toFixed(1), risk_level: ["LOW","MODERATE","HIGH","CRITICAL"][Math.floor(Math.random()*4)] },
      { region_id: "NR", region_name: "Northern Region", load_pct: +(70 + Math.random() * 25).toFixed(1), saturation_prob: +(Math.random() * 85).toFixed(1), risk_level: ["MODERATE","HIGH","CRITICAL"][Math.floor(Math.random()*3)] },
      { region_id: "SR", region_name: "Southern Region", load_pct: +(60 + Math.random() * 30).toFixed(1), saturation_prob: +(Math.random() * 60).toFixed(1), risk_level: ["LOW","MODERATE","HIGH"][Math.floor(Math.random()*3)] },
    ],
    alerts: seq % 8 === 0 ? [{ id: `a-${t}`, severity: "WARNING", category: "POWER", message: "Grid load elevated — Maharashtra Western Region", region: "Maharashtra", lat: 19.07, lng: 72.87, timestamp: new Date().toISOString() }] : [],
    connected_clients: 1,
    timestamp: new Date().toISOString(),
  };
}

export function useTelemetry() {
  const [frame, setFrame] = useState<TelemetryFrame>(() => generateFallback(0));
  const [history, setHistory] = useState<{ t: number; sensex: number; nifty: number; bankNifty: number }[]>([]);
  const [alerts, setAlerts] = useState<TelemetryFrame["alerts"]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const seqRef = useRef(0);
  const reconnectRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => { setConnected(true); };
      ws.onmessage = (e) => {
        try {
          const data: TelemetryFrame = JSON.parse(e.data);
          setFrame(data);
          setHistory(prev => {
            const next = [...prev, { t: Date.now(), sensex: data.sensex.value, nifty: data.nifty.value, bankNifty: data.bank_nifty.value }];
            return next.length > HISTORY_MAX ? next.slice(-HISTORY_MAX) : next;
          });
          if (data.alerts.length > 0) {
            setAlerts(prev => [...data.alerts, ...prev].slice(0, 50));
          }
        } catch {}
      };
      ws.onerror = () => ws.close();
      ws.onclose = () => {
        setConnected(false);
        reconnectRef.current = setTimeout(connect, RECONNECT_DELAY);
      };
    } catch {
      // Use fallback simulation
      setConnected(false);
    }
  }, []);

  // Fallback simulation when WS unavailable
  useEffect(() => {
    connect();
    const sim = setInterval(() => {
      if (!connected && (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)) {
        seqRef.current++;
        const fb = generateFallback(seqRef.current);
        setFrame(fb);
        setHistory(prev => {
          const next = [...prev, { t: Date.now(), sensex: fb.sensex.value, nifty: fb.nifty.value, bankNifty: fb.bank_nifty.value }];
          return next.length > HISTORY_MAX ? next.slice(-HISTORY_MAX) : next;
        });
        if (seqRef.current % 8 === 0) {
          setAlerts(prev => [{
            id: `fb-${Date.now()}`,
            severity: ["CRITICAL","WARNING","INFO"][Math.floor(Math.random()*3)],
            category: ["POWER","AQI","TRAFFIC","WEB3","CLOUD"][Math.floor(Math.random()*5)],
            message: [
              "Grid load at 94% — Maharashtra Western Region",
              "AQI spike 312 μg/m³ — Delhi NCR",
              "Highway congestion CRITICAL on NH-44 near Nashik",
              "Web3 node burst +48% — Bengaluru tech corridor",
              "AWS ap-south-1 latency +180ms detected",
              "Monsoon vector 15° north of forecast",
              "Sensex crosses 73,000 intraday",
              "CTF team 'ByteBreakers' wins IIT Bombay hackathon",
            ][Math.floor(Math.random()*8)],
            region: ["Maharashtra","Delhi","Karnataka","Tamil Nadu"][Math.floor(Math.random()*4)],
            lat: 19.07 + Math.random(), lng: 72.87 + Math.random(),
            timestamp: new Date().toISOString(),
          }, ...prev].slice(0, 50));
        }
      }
    }, 300);

    return () => {
      clearInterval(sim);
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [connect, connected]);

  return { frame, history, alerts, connected };
}
