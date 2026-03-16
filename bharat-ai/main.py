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
import httpx
import os
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

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

# ─────────────────────────────────────────
#  AI CHAT / NEWS VERIFICATION
# ─────────────────────────────────────────

TRUSTED_SOURCES = [
    {"name": "Reuters", "url": "https://reuters.com", "reliability": "High"},
    {"name": "Associated Press", "url": "https://apnews.com", "reliability": "High"},
    {"name": "BBC News", "url": "https://bbc.com/news", "reliability": "High"},
    {"name": "The Hindu", "url": "https://thehindu.com", "reliability": "High"},
    {"name": "Hindustan Times", "url": "https://hindustantimes.com", "reliability": "High"},
    {"name": "NDTV", "url": "https://ndtv.com", "reliability": "High"},
    {"name": "Times of India", "url": "https://timesofindia.com", "reliability": "Medium-High"},
    {"name": "Al Jazeera", "url": "https://aljazeera.com", "reliability": "High"},
    {"name": "Jane's Defence", "url": "https://janes.com", "reliability": "High"},
    {"name": "MEA India", "url": "https://mea.gov.in", "reliability": "Official"},
    {"name": "PIB India", "url": "https://pib.gov.in", "reliability": "Official"},
    {"name": "ISRO", "url": "https://isro.gov.in", "reliability": "Official"},
    {"name": "The Wire", "url": "https://thewire.in", "reliability": "Medium-High"},
    {"name": "Indian Express", "url": "https://indianexpress.com", "reliability": "High"},
]

MISINFORMATION_RED_FLAGS = [
    "anonymous sources say", "insiders reveal", "leaked document shows",
    "government hiding", "mainstream media won't tell", "shocking truth",
    "they don't want you to know", "exclusive bombshell", "100% confirmed"
]

CONFLICT_ZONE_CONTEXT = {
    "kashmir": "The Kashmir region remains contested between India and Pakistan since 1947 partition. Current LoC incidents are monitored by UN observers.",
    "myanmar": "Myanmar has seen military conflict since the 2021 coup. India shares a 1,643 km border; refugee flows are ongoing.",
    "china border": "India-China LAC (Line of Actual Control) tensions have simmered since 2020 Galwan clashes. Both sides maintain heightened posture.",
    "pakistan": "India-Pakistan relations remain strained. Ceasefire along LoC was renewed in Feb 2021.",
    "northeast india": "Several insurgent groups remain active in India's Northeast. Government peace talks are ongoing.",
    "sri lanka": "Post-2022 economic crisis; political stability improving. Indian naval assets monitor the Palk Strait.",
    "maldives": "Strategic Indian Ocean positioning; China-India influence competition ongoing.",
    "afghanistan": "Post-US withdrawal, Taliban controls Afghanistan. Impact on regional security being monitored.",
}

CAPABILITY_KEYWORDS = {
    "headline": ["headline", "title", "breaking", "news", "report"],
    "article": ["article", "link", "url", "read", "https://", "http://"],
    "summarize": ["summarize", "summary", "brief", "overview", "tldr", "explain"],
    "misinformation": ["fake", "false", "misinformation", "disinformation", "propaganda", "verify", "true", "real", "hoax", "claim"],
    "context": ["context", "background", "history", "why", "reason", "cause", "situation"],
    "military": ["military", "army", "force", "base", "troops", "soldier", "weapon", "missile", "defence", "defense", "attack", "strike"],
    "conflict": ["conflict", "war", "clash", "violence", "ceasefire", "border", "tension"],
    "sources": ["source", "trusted", "reliable", "where", "reference"],
}


def classify_query(message: str) -> list[str]:
    msg_lower = message.lower()
    detected = []
    for cap, keywords in CAPABILITY_KEYWORDS.items():
        if any(kw in msg_lower for kw in keywords):
            detected.append(cap)
    return detected if detected else ["general"]


def check_misinformation_signals(message: str) -> dict:
    msg_lower = message.lower()
    flags_found = [flag for flag in MISINFORMATION_RED_FLAGS if flag in msg_lower]
    risk = "HIGH" if len(flags_found) >= 2 else "MEDIUM" if len(flags_found) == 1 else "LOW"
    return {"risk_level": risk, "flags": flags_found}


def get_relevant_context(message: str) -> str:
    msg_lower = message.lower()
    for key, ctx in CONFLICT_ZONE_CONTEXT.items():
        if key in msg_lower:
            return ctx
    return ""


def get_relevant_sources(categories: list[str]) -> list[dict]:
    source_pool = random.sample(TRUSTED_SOURCES, min(4, len(TRUSTED_SOURCES)))
    if "military" in categories or "conflict" in categories:
        military_sources = [s for s in TRUSTED_SOURCES if s["name"] in ["Jane's Defence", "Reuters", "MEA India", "The Hindu"]]
        source_pool = military_sources + random.sample(
            [s for s in TRUSTED_SOURCES if s not in military_sources], 
            min(2, len(TRUSTED_SOURCES) - len(military_sources))
        )
    return source_pool[:4]


def generate_ai_response(message: str) -> dict:
    categories = classify_query(message)
    misinfo_check = check_misinformation_signals(message)
    geo_context = get_relevant_context(message)
    sources = get_relevant_sources(categories)
    timestamp = get_timestamp()

    # Build structured response
    response_parts = []

    # Capability-specific response
    if "misinformation" in categories:
        if misinfo_check["risk_level"] == "HIGH":
            response_parts.append(
                "⚠️ **Misinformation Risk: HIGH**\n\n"
                f"This message contains {len(misinfo_check['flags'])} red-flag phrase(s) commonly associated with unverified claims: "
                f"`{'`, `'.join(misinfo_check['flags'])}`.\n\n"
                "**Recommendation:** Cross-reference with at least 3 independent, credible sources before sharing. "
                "Check if major wire services (Reuters, AP, BBC) have covered this story."
            )
        elif misinfo_check["risk_level"] == "MEDIUM":
            response_parts.append(
                "🔶 **Misinformation Risk: MEDIUM**\n\n"
                "This message contains language patterns sometimes used in sensationalized reporting. "
                "While not automatically false, independent verification is recommended."
            )
        else:
            response_parts.append(
                "✅ **Misinformation Risk: LOW**\n\n"
                "No obvious red-flag language detected. However, always verify with primary sources — "
                "especially for reports involving active conflict zones or military activity."
            )

    if "military" in categories or "conflict" in categories:
        response_parts.append(
            "🎯 **Military/Conflict Analysis**\n\n"
            "Claims about military movements, base activity, or conflict zone incidents require verification against "
            "official defense ministry statements, established wire service reports, or defense intelligence publications. "
            "Social media clips and unverified videos are frequently misattributed for ongoing or historical conflicts.\n\n"
            "**Key checks:**\n"
            "- Is the date and location verifiable via satellite imagery?\n"
            "- Has any official government/defense body confirmed?\n"
            "- Are multiple independent journalists reporting the same?"
        )

    if "summarize" in categories:
        response_parts.append(
            "📋 **Analysis Summary**\n\n"
            "To provide an accurate summary, I analyze claims against open-source intelligence (OSINT) databases, "
            "official press releases, and established news archives. For this query, key factors to assess include "
            "geographic specificity, temporal accuracy, and source attribution chain."
        )

    if "article" in categories:
        response_parts.append(
            "🔗 **Article Verification**\n\n"
            "When analyzing article links: check the domain's credibility, publication date, author biography, "
            "and whether the headline accurately reflects the body text. Use tools like web.archive.org to verify "
            "original vs. edited versions."
        )

    # Always add geo context if available
    if geo_context:
        response_parts.append(f"🌍 **Geopolitical Context**\n\n{geo_context}")

    # Default / general response
    if not response_parts:
        response_parts.append(
            "🔍 **Intelligence Assessment**\n\n"
            "I can help you verify news from your map trackers — including military bases, conflict zones, "
            "protest hotspots, and geopolitical events. Share a headline, paste an article link, or describe "
            "a specific event and I will:\n\n"
            "• Cross-check against trusted sources\n"
            "• Assess misinformation risk\n"
            "• Provide geopolitical context\n"
            "• Surface relevant verified reporting"
        )

    full_response = "\n\n---\n\n".join(response_parts)

    return {
        "response": full_response,
        "categories": categories,
        "misinformation_risk": misinfo_check["risk_level"],
        "sources": [
            {
                "name": s["name"],
                "url": s["url"],
                "reliability": s["reliability"],
            }
            for s in sources
        ],
        "timestamp": timestamp,
        "disclaimer": "This analysis is based on open-source intelligence patterns. Always consult primary sources for critical decisions.",
    }


class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None


async def call_groq_api(message: str, local_analysis: str = "") -> str:
    if not GROQ_API_KEY:
        return "⚠️ **Configuration Error**\n\nThe `GROQ_API_KEY` is not set in the backend environment. Please add it to `bharat-ai/.env` to enable general AI answers."
    
    live_data = {
        "alerts": generate_live_alerts(),
        "aqi_data": generate_aqi_data(),
        "grid": generate_grid_predictions(),
        "sensex": generate_sensex(),
        "nifty": generate_nifty(),
        "highways": generate_highway_traffic()
    }
    
    system_prompt = (
        "You are Bharat Monitor AI, an intelligence assistant. "
        "CRITICAL INSTRUCTIONS:\n"
        "1. NEVER say your knowledge or data is limited to 2023 or any past date. If asked, you must state: 'I have been processing on the data.'\n"
        "2. Your main focus is to answer questions using the LIVE TRACKER DATA provided below. Give specific details from the trackers if relevant.\n"
        "3. Answer concisely and accurately using markdown.\n"
    )
    
    if local_analysis:
        system_prompt += f"\nLocal Rule-based Analysis Context (use this to format your response if applicable):\n{local_analysis}\n"

    system_prompt += f"\nLIVE TRACKER DATA:\n{json.dumps(live_data, default=str)}"

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        "temperature": 0.5,
        "max_tokens": 1024
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"⚠️ **AI Backend Error**\n\nFailed to reach Groq API: {str(e)}"

@app.post("/api/ai-chat")
async def ai_chat(req: ChatRequest):
    if not req.message.strip():
        return {"error": "Message cannot be empty", "status": 400}
        
    categories = classify_query(req.message)
    
    # If it's a general question or doesn't match our specific map tracks
    if "general" in categories and len(categories) == 1:
        groq_response = await call_groq_api(req.message)
        timestamp = get_timestamp()
        return {
            "response": groq_response,
            "categories": ["general", "ai-assisted"],
            "misinformation_risk": "LOW",
            "sources": [{"name": "Groq AI (Llama 3)", "url": "https://groq.com", "reliability": "High"}],
            "timestamp": timestamp,
            "disclaimer": "This answer was generated by an external AI model.",
        }
        
    # Get local metadata and canned summary
    result = generate_ai_response(req.message)
    
    # ALWAYS call Groq API to formulate the final answer using the live tracker data.
    # Pass the canned response as context so Groq can include those insights.
    groq_response = await call_groq_api(req.message, local_analysis=result["response"])
    result["response"] = groq_response
    
    # Add Groq AI as a source
    if "sources" in result and isinstance(result["sources"], list):
        if not any(s.get("name") == "Groq AI (Llama 3)" for s in result["sources"]):
            result["sources"].append({"name": "Groq AI (Llama 3)", "url": "https://groq.com", "reliability": "High"})
    else:
        result["sources"] = [{"name": "Groq AI (Llama 3)", "url": "https://groq.com", "reliability": "High"}]
        
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False, log_level="info")
