import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Polygon, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TECH_CITIES, CONFLICT_ZONES, MILITARY_BASES, NUCLEAR_SITES, PORTS, UNDERSEA_CABLES, INFLUENCE_CIRCLES, WATERWAYS, UNIVERSITIES, HIGHWAYS, SEVERITY_COLOR, AQI_COLOR, COUNTRY_INTEL,
TERROR_INCIDENTS, MAJOR_PORTS, INCUBATION_CENTERS, RIVER_TRADE_ROUTES, POLITICAL_ZONES, PROTEST_HOTSPOTS, AIRWAY_CORRIDORS, UNDERSEA_PIPELINES, CONFLICT_ZONES_TRACKER, OVERLAND_PIPELINES,
PREDICTIONS, TRADE_POLICIES, STUDENT_PROTESTS, GOV_COLLEGES, THINK_TANKS, RAILWAY_LINES, TRAFFIC_JAMS, MAJOR_HIGHWAY_PROJECTS, SLUDGE_PIPELINES, SLURRY_PIPELINES, SPACE_PORTS, INTEL_HOTSPOTS, AVIATION_HUBS, MILITARY_ACTIVITY, DISPLACEMENT_FLOWS, STRATEGIC_WATERWAYS, NATURAL_EVENTS, CYBER_THREATS, INTERNET_OUTAGES, CRITICAL_MINERALS, FIRES, WEATHER_ALERTS, WAR_ZONES_POLYGONS
} from "../lib/data";
import type { TelemetryFrame } from "../hooks/useTelemetry";

// ── Custom icons ─────────────────────────────────────────────────────────────

function makeCityIcon(city: typeof TECH_CITIES[0]) {
  const colors: Record<string, string> = { tech: "#00FFFF", finance: "#FFD700", government: "#FF9933", defense: "#FF3355", trade: "#00FF88", logistics: "#CC44FF", tourism: "#FFAAFF", manufacturing: "#44AAFF" };
  const color = colors[city.type] || "#00FFFF";
  const sz = city.tier === 1 ? 10 : 7;
  return L.divIcon({
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    html: `<div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:${color}11;border:1px solid ${color}44;animation:pulse-marker ${city.tier===1?"4":"6"}s ease-in-out infinite;"></div>
      <div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color}99;"></div>
    </div>`,
  });
}

function makeUniIcon() {
  return L.divIcon({
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<div style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:12px;filter:drop-shadow(0 0 4px rgba(0,255,255,0.6))">🎓</div>`,
  });
}

function makeBaseIcon(country: string) {
  const color = country === "India" ? "#00FF88" : country === "China" ? "#FF4444" : "#FF9933";
  return L.divIcon({
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `<div style="width:14px;height:14px;background:${color};clip-path:polygon(50% 0%,0% 100%,100% 100%);box-shadow:0 0 6px ${color}88;"></div>`,
  });
}

function makeNuclearIcon() {
  return L.divIcon({
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<div style="font-size:14px;filter:drop-shadow(0 0 5px rgba(255,215,0,0.8))">☢️</div>`,
  });
}

function makePortIcon() {
  return L.divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<div style="font-size:13px;filter:drop-shadow(0 0 4px rgba(0,200,255,0.8))">⚓</div>`,
  });
}

function makeWaterwayIcon() {
  return L.divIcon({
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<div style="font-size:14px;filter:drop-shadow(0 0 5px rgba(0,100,255,0.8))">🌊</div>`,
  });
}

// ── Layer types ───────────────────────────────────────────────────────────────
export type LayerConfig = {
  cities: boolean;
  techCenters: boolean;
  universities: boolean;
  conflictZones: boolean;
  militaryBases: boolean;
  nuclearSites: boolean;
  ports: boolean;
  underseaCables: boolean;
  influenceCircles: boolean;
  waterways: boolean;
  highways: boolean;
  aqi: boolean;
  terrorIncidents: boolean;
  majorPorts: boolean;
  incubationCenters: boolean;
  riverTradeRoutes: boolean;
  politicalZones: boolean;
  protestHotspots: boolean;
  airwayCorridors: boolean;
  underseaPipelines: boolean;
  persistentConflictZones: boolean;
  overlandPipelines: boolean;
  // Phase 11
  predictions: boolean;
  tradePolicies: boolean;
  studentProtests: boolean;
  govColleges: boolean;
  thinkTanks: boolean;
  railwayLines: boolean;
  trafficJams: boolean;
  majorHighwayProjects: boolean;
  sludgePipelines: boolean;
  slurryPipelines: boolean;
  spacePorts: boolean;
  intelHotspots: boolean;
  aviationHubs: boolean;
  militaryActivity: boolean;
  displacementFlows: boolean;
  strategicWaterways: boolean;
  naturalEvents: boolean;
  cyberThreats: boolean;
  internetOutages: boolean;
  criticalMinerals: boolean;
  fires: boolean;
  weatherAlerts: boolean;
  // Phase 12
  warZones: boolean;
};

interface Props {
  layers: LayerConfig;
  frame: TelemetryFrame;
  onCountryClick: (country: string) => void;
}

// ── AQI mock map ─────────────────────────────────────────────────────────────
const AQI_DATA = TECH_CITIES.slice(0, 12).map((c, i) => ({
  ...c, aqi: [312, 285, 145, 102, 78, 118, 198, 167, 88, 130, 95, 110][i] || 100
}));

export default function BharatMapInner({ layers, frame, onCountryClick }: Props) {
  const cityColor: Record<string, string> = { tech: "#00FFFF", finance: "#FFD700", government: "#FF9933", defense: "#FF3355", trade: "#00FF88", logistics: "#CC44FF", tourism: "#FFAAFF", manufacturing: "#44AAFF" };

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ width: "100%", height: "100%", background: "#0A0A0A" }}
      zoomControl={true}
      attributionControl={true}
      preferCanvas={true}
    >
      {/* CartoDB Dark Matter tile */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {/* ── CONFLICT ZONES ───────────────────────────── */}
      {layers.conflictZones && CONFLICT_ZONES.map(zone => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates.map(([lat, lng]) => [lat, lng] as [number, number])}
          pathOptions={{ color: zone.color, fillColor: zone.fillColor, fillOpacity: zone.fillOpacity, weight: 1.5, dashArray: "4 4" }}
        >
          <Popup>
            <div className="p-2">
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: zone.color, fontWeight: 700 }}>{zone.name}</span>
              </div>
              <p style={{ fontSize: 11, color: "#aaa" }}>{zone.description}</p>
              <div style={{ marginTop: 6, display: "flex", gap: 8, fontSize: 11 }}>
                <span style={{ color: "#FF3355" }}>⚡ {zone.incidents_30d} incidents/30d</span>
                <span style={{ color: "#FFD700" }}>☠ {zone.casualties_2024} 2024</span>
              </div>
            </div>
          </Popup>
        </Polygon>
      ))}

      {/* ── INFLUENCE CIRCLES ────────────────────────── */}
      {layers.influenceCircles && INFLUENCE_CIRCLES.map(c => (
        <Circle
          key={c.name}
          center={[c.lat, c.lng]}
          radius={c.radius}
          pathOptions={{ color: c.color, fillColor: c.color, fillOpacity: 0.03, weight: 1.2, dashArray: "6 4" }}
        >
          <Popup>
            <div className="p-2">
              <div style={{ color: c.color, fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
              <p style={{ fontSize: 11, color: "#aaa" }}>{c.desc}</p>
              <p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>Radius: {(c.radius/1000).toFixed(0)} km</p>
            </div>
          </Popup>
        </Circle>
      ))}

      {/* ── MAJOR CITIES & TECH CENTERS ──────────────── */}
      {(layers.cities || layers.techCenters) && TECH_CITIES.map(city => {
        if (!layers.cities && city.tier === 2) return null;
        if (!layers.techCenters && city.tier === 1) return null;
        const color = cityColor[city.type] || "#00FFFF";
        return (
          <Marker key={city.name} position={[city.lat, city.lng]} icon={makeCityIcon(city)}>
            <Popup>
              <div style={{ minWidth: 220 }}>
                <div style={{ borderBottom: `1px solid ${color}33`, paddingBottom: 6, marginBottom: 6 }}>
                  <div style={{ color, fontWeight: 700, fontSize: 14 }}>{city.name}</div>
                  <div style={{ color: "#888", fontSize: 11 }}>{city.state}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11 }}>
                  <div><span style={{ color: "#555" }}>Type</span><br /><span style={{ color }}>{city.type.toUpperCase()}</span></div>
                  <div><span style={{ color: "#555" }}>Tech Score</span><br /><span style={{ color: "#00FF88", fontWeight: 700 }}>{city.techScore}/100</span></div>
                  <div><span style={{ color: "#555" }}>Population</span><br /><span style={{ color: "#eee" }}>{city.pop}M</span></div>
                  <div><span style={{ color: "#555" }}>Tier</span><br /><span style={{ color: "#FFD700" }}>Tier {city.tier}</span></div>
                </div>
                <div style={{ marginTop: 6, fontSize: 11, color: "#aaa" }}>{city.desc}</div>
                <button
                  onClick={() => onCountryClick("India")}
                  style={{ marginTop: 8, width: "100%", padding: "4px 0", background: "#00FFFF11", border: "1px solid #00FFFF33", borderRadius: 6, color: "#00FFFF", fontSize: 11, cursor: "pointer" }}
                >
                  View India Intel →
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* ── AQI CIRCLES ──────────────────────────────── */}
      {layers.aqi && AQI_DATA.map(city => (
        <Circle
          key={`aqi-${city.name}`}
          center={[city.lat, city.lng]}
          radius={40000}
          pathOptions={{ color: AQI_COLOR(city.aqi), fillColor: AQI_COLOR(city.aqi), fillOpacity: 0.22, weight: 0 }}
        >
          <Popup>
            <div className="p-1">
              <div style={{ color: AQI_COLOR(city.aqi), fontWeight: 700 }}>{city.name}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>AQI: <span style={{ color: AQI_COLOR(city.aqi), fontWeight: 700 }}>{city.aqi}</span></div>
              <div style={{ fontSize: 10, color: "#666" }}>
                {city.aqi > 300 ? "Hazardous" : city.aqi > 200 ? "Very Unhealthy" : city.aqi > 150 ? "Unhealthy" : city.aqi > 100 ? "Moderate" : "Good"}
              </div>
            </div>
          </Popup>
        </Circle>
      ))}

      {/* ── UNIVERSITIES / HACKATHON HUBS ────────────── */}
      {layers.universities && UNIVERSITIES.map(uni => (
        <Marker key={uni.name} position={[uni.lat, uni.lng]} icon={makeUniIcon()}>
          <Popup>
            <div>
              <div style={{ color: "#00FFFF", fontWeight: 700, fontSize: 13 }}>{uni.name}</div>
              <div style={{ color: "#888", fontSize: 11 }}>{uni.city}</div>
              <div style={{ marginTop: 4, fontSize: 11, color: "#FFD700" }}>Ranked #{uni.rank} in India</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* ── MILITARY BASES ───────────────────────────── */}
      {layers.militaryBases && MILITARY_BASES.map(base => (
        <Marker key={base.name} position={[base.lat, base.lng]} icon={makeBaseIcon(base.country)}>
          <Popup>
            <div>
              <div style={{ color: base.country === "India" ? "#00FF88" : base.country === "China" ? "#FF4444" : "#FF9933", fontWeight: 700 }}>{base.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{base.country} · {base.type.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: SEVERITY_COLOR[base.strength] || "#fff", marginTop: 2 }}>Strength: {base.strength}</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* ── NUCLEAR SITES ────────────────────────────── */}
      {layers.nuclearSites && NUCLEAR_SITES.map(site => (
        <Marker key={site.name} position={[site.lat, site.lng]} icon={makeNuclearIcon()}>
          <Popup>
            <div>
              <div style={{ color: "#FFD700", fontWeight: 700 }}>{site.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{site.type.toUpperCase()} · {site.status}</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* ── PORTS ────────────────────────────────────── */}
      {layers.ports && PORTS.map(port => (
        <Marker key={port.name} position={[port.lat, port.lng]} icon={makePortIcon()}>
          <Popup>
            <div>
              <div style={{ color: "#00CCFF", fontWeight: 700 }}>{port.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{port.type.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>Cargo: {port.cargo_mt}MT/yr</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* ── UNDERSEA CABLES ──────────────────────────── */}
      {layers.underseaCables && UNDERSEA_CABLES.map(cable => (
        <Polyline
          key={cable.name}
          positions={cable.coordinates.map(([lat, lng]) => [lat, lng] as [number, number])}
          pathOptions={{ color: "#0088FF", weight: 2, opacity: 0.7, dashArray: "8 4" }}
        >
          <Popup>
            <div>
              <div style={{ color: "#0088FF", fontWeight: 700 }}>{cable.name}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>Capacity: {cable.capacity_tbps} Tbps</div>
            </div>
          </Popup>
        </Polyline>
      ))}

      {/* ── STRATEGIC WATERWAYS ──────────────────────── */}
      {layers.waterways && WATERWAYS.map(w => (
        <Marker key={w.name} position={[w.lat, w.lng]} icon={makeWaterwayIcon()}>
          <Popup>
            <div>
              <div style={{ color: "#44AAFF", fontWeight: 700 }}>{w.name}</div>
              <div style={{ fontSize: 11, color: SEVERITY_COLOR[w.importance] }}>{w.importance}</div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{w.desc}</div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* ── HIGHWAY NETWORK ──────────────────────────── */}
      {layers.highways && HIGHWAYS.map(hw => {
        const hwFrame = frame.highways.find(h => h.id === hw.id);
        const congestion = hwFrame?.congestion_index || 0.5;
        const color = congestion > 0.8 ? "#FF3355" : congestion > 0.6 ? "#FF9933" : congestion > 0.4 ? "#FFD700" : "#00FF88";
        return (
          <Polyline
            key={hw.id}
            positions={hw.path.map(([lat, lng]) => [lat, lng] as [number, number])}
            pathOptions={{ color, weight: 2.5, opacity: 0.75 }}
          >
            <Popup>
              <div>
                <div style={{ color, fontWeight: 700 }}>{hw.name}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                  Congestion: {(congestion * 100).toFixed(0)}% · {hwFrame?.avg_speed_kmh || "—"} km/h
                </div>
                {hwFrame && <div style={{ fontSize: 11, color: SEVERITY_COLOR[hwFrame.status] }}>{hwFrame.status}</div>}
              </div>
            </Popup>
          </Polyline>
        );
      })}

      {/* ── LIVE ALERT PULSES ────────────────────────── */}
      {frame.alerts.map(alert => (
        <Circle
          key={alert.id}
          center={[alert.lat, alert.lng]}
          radius={25000}
          pathOptions={{ color: SEVERITY_COLOR[alert.severity] || "#FF9933", fillColor: SEVERITY_COLOR[alert.severity] || "#FF9933", fillOpacity: 0.25, weight: 1 }}
        >
          <Popup>
            <div>
              <div style={{ color: SEVERITY_COLOR[alert.severity], fontWeight: 700, fontSize: 12 }}>{alert.severity} — {alert.category}</div>
              <div style={{ fontSize: 11, color: "#ddd", marginTop: 2 }}>{alert.message}</div>
            </div>
          </Popup>
        </Circle>
      ))}

      {/* ── NEW TRACKERS ──────────────────────────────── */}
      {layers.terrorIncidents && TERROR_INCIDENTS.map(([lat, lng, name, deaths], i) => (
        <CircleMarker key={`terror-${i}`} center={[lat, lng]} radius={Math.max(deaths/2.5, 10)} fillColor="#F25C75" color="#F25C75" weight={2} fillOpacity={0.6}>
          <Popup><div style={{ color: '#F25C75', fontWeight: 'bold' }}>💥 {name}</div><div style={{fontSize:11, color:'#aaa'}}>Fatalities: {deaths}</div><div style={{fontSize:11, color:'#888', marginTop:2}}>Critical security incident</div></Popup>
        </CircleMarker>
      ))}

      {layers.majorPorts && MAJOR_PORTS.map(([lat, lng, name, desc], i) => (
        <Marker key={`mport-${i}`} position={[lat, lng]} icon={makePortIcon()}>
          <Popup><div style={{ color: '#4DD2D2', fontWeight: 'bold' }}>⚓ {name}</div><div style={{fontSize:11, color:'#888'}}>{desc}</div><div style={{fontSize:11, color:'#aaa', marginTop:2}}>95% of India trade volume</div></Popup>
        </Marker>
      ))}

      {layers.incubationCenters && INCUBATION_CENTERS.map(([lat, lng, name], i) => (
        <CircleMarker key={`inc-${i}`} center={[lat, lng]} radius={12} fillColor="#F2D14D" color="#F2A65A" weight={2} fillOpacity={0.6}>
          <Popup><div style={{ color: '#F2D14D', fontWeight: 'bold' }}>🚀 {name}</div><div style={{fontSize:11, color:'#888', marginTop:2}}>Technology Business Incubator</div></Popup>
        </CircleMarker>
      ))}

      {layers.riverTradeRoutes && RIVER_TRADE_ROUTES.map((route, i) => (
        <Polyline key={`river-${i}`} positions={route.map(([lat, lng]) => [lat, lng] as [number, number])} weight={4} color="#4DD2D2" dashArray="8,6" opacity={0.7}>
          <Popup><div style={{ color: '#4DD2D2', fontWeight: 'bold' }}>🌊 Interstate River Trade</div><div style={{fontSize:11, color:'#888'}}>Water dispute corridor</div><div style={{fontSize:11, color:'#aaa', marginTop:2}}>Critical agriculture lifeline</div></Popup>
        </Polyline>
      ))}

      {layers.politicalZones && POLITICAL_ZONES.map(([lat, lng, name, status], i) => (
        <CircleMarker key={`pol-${i}`} center={[lat, lng]} radius={15} fillColor={status === "High Tension" ? "#F25C75" : "#4DE6A1"} color="transparent" weight={0} fillOpacity={0.4}>
          <Popup><div style={{ color: status === "High Tension" ? "#F25C75" : "#4DE6A1", fontWeight: 'bold' }}>🗳️ {name}</div><div style={{fontSize:11, color:'#888', marginTop:2}}>Status: {status}</div></Popup>
        </CircleMarker>
      ))}

      {layers.protestHotspots && PROTEST_HOTSPOTS.map(([lat, lng, name], i) => (
        <CircleMarker key={`protest-${i}`} center={[lat, lng]} radius={16} fillColor="#F2A65A" color="#F2A65A" weight={2} fillOpacity={0.5}>
          <Popup><div style={{ color: '#F2A65A', fontWeight: 'bold' }}>🪧 LIVE PROTEST</div><div style={{fontSize:11, color:'#aaa'}}>{name}</div><div style={{fontSize:11, color:'#888', marginTop:2}}>Active disruption detected</div></Popup>
        </CircleMarker>
      ))}

      {layers.airwayCorridors && AIRWAY_CORRIDORS.map((route, i) => (
        <Polyline key={`air-${i}`} positions={route.map(([lat, lng]) => [lat, lng] as [number, number])} weight={2} color="#9A73E6" dashArray="4,4" opacity={0.5}>
          <Popup><div style={{ color: '#9A73E6', fontWeight: 'bold' }}>✈️ Major Air Corridor</div><div style={{fontSize:11, color:'#888'}}>High-density flight path</div><div style={{fontSize:11, color:'#aaa', marginTop:2}}>Aviation security alert</div></Popup>
        </Polyline>
      ))}

      {layers.underseaPipelines && UNDERSEA_PIPELINES.map((pipe, i) => (
        <Polyline key={`seapipe-${i}`} positions={pipe.map(([lat, lng]) => [lat, lng] as [number, number])} weight={3} color="#F2A65A" dashArray="8,8" opacity={0.7}>
          <Popup><div style={{ color: '#F2A65A', fontWeight: 'bold' }}>🌊 UNDERSEA PIPELINE</div><div style={{fontSize:11, color:'#888'}}>Critical gas infrastructure</div></Popup>
        </Polyline>
      ))}

      {layers.persistentConflictZones && CONFLICT_ZONES_TRACKER.map(([lat, lng, name], i) => (
        <CircleMarker key={`pconflict-${i}`} center={[lat, lng]} radius={24} fillColor="#F25C75" color="transparent" weight={0} fillOpacity={0.2}>
          <Popup><div style={{ color: '#F25C75', fontWeight: 'bold' }}>⚠️ {name}</div><div style={{fontSize:11, color:'#888'}}>Persistent Conflict Zone</div></Popup>
        </CircleMarker>
      ))}

      {layers.overlandPipelines && OVERLAND_PIPELINES.map((pipe, i) => (
        <Polyline key={`oline-${i}`} positions={pipe.map(([lat, lng]) => [lat, lng] as [number, number])} weight={3} color="#F2D14D" dashArray="10,6" opacity={0.6}>
          <Popup><div style={{ color: '#F2D14D', fontWeight: 'bold' }}>🛢️ HVJ Pipeline</div><div style={{fontSize:11, color:'#888'}}>Hazira-Vijaipur-Jagdishpur</div></Popup>
        </Polyline>
      ))}

      {/* ── PHASE 11 TRACKERS ──────────────────────────── */}

      {layers.predictions && PREDICTIONS.map((p, i) => (
        <CircleMarker key={`pred-${i}`} center={[p.lat, p.lng]} radius={7} fillColor="#7B93DB" color="#7B93DB" weight={1} fillOpacity={0.6}>
          <Popup><div style={{ color: '#7B93DB', fontWeight: 'bold' }}>🔮 {p.name}</div><div style={{fontSize:11, color:'#aaa'}}>{p.desc}</div></Popup>
        </CircleMarker>
      ))}

      {layers.tradePolicies && TRADE_POLICIES.map((t, i) => (
        <CircleMarker key={`trade-${i}`} center={[t.lat, t.lng]} radius={8} fillColor="#6BC5A0" color="#6BC5A0" weight={1} fillOpacity={0.6}>
          <Popup><div style={{ color: '#6BC5A0', fontWeight: 'bold' }}>📦 {t.name}</div><div style={{fontSize:11, color:'#aaa'}}>{t.desc}</div></Popup>
        </CircleMarker>
      ))}

      {layers.studentProtests && STUDENT_PROTESTS.map((s, i) => (
        <CircleMarker key={`stuprotest-${i}`} center={[s.lat, s.lng]} radius={10} fillColor={s.severity === 'HIGH' ? '#F25C75' : s.severity === 'MODERATE' ? '#F2A65A' : '#F2D14D'} color="transparent" weight={0} fillOpacity={0.5}>
          <Popup><div style={{ color: '#F25C75', fontWeight: 'bold' }}>📢 {s.name}</div><div style={{fontSize:11, color:'#aaa'}}>{s.cause}</div></Popup>
        </CircleMarker>
      ))}

      {layers.govColleges && GOV_COLLEGES.map((g, i) => (
        <CircleMarker key={`govcol-${i}`} center={[g.lat, g.lng]} radius={6} fillColor="#A8D8EA" color="#A8D8EA" weight={1} fillOpacity={0.7}>
          <Popup><div style={{ color: '#A8D8EA', fontWeight: 'bold' }}>🏛️ {g.name}</div><div style={{fontSize:11, color:'#aaa'}}>{g.type} university</div></Popup>
        </CircleMarker>
      ))}

      {layers.thinkTanks && THINK_TANKS.map((t, i) => (
        <CircleMarker key={`think-${i}`} center={[t.lat, t.lng]} radius={7} fillColor="#C3AED6" color="#C3AED6" weight={1} fillOpacity={0.6}>
          <Popup><div style={{ color: '#C3AED6', fontWeight: 'bold' }}>🧠 {t.name}</div><div style={{fontSize:11, color:'#aaa'}}>{t.focus}</div></Popup>
        </CircleMarker>
      ))}

      {layers.railwayLines && RAILWAY_LINES.map((r, i) => (
        <Polyline key={`rail-${i}`} positions={r.coords} weight={2} color={r.type === 'rajdhani' ? '#F2A65A' : r.type === 'freight' ? '#8B8B8B' : '#6BC5A0'} dashArray="6,4" opacity={0.6}>
          <Popup><div style={{ color: '#F2A65A', fontWeight: 'bold' }}>🚂 {r.name}</div><div style={{fontSize:11, color:'#aaa'}}>{r.type} corridor</div></Popup>
        </Polyline>
      ))}

      {layers.trafficJams && TRAFFIC_JAMS.map((j, i) => (
        <CircleMarker key={`jam-${i}`} center={[j.lat, j.lng]} radius={10} fillColor={j.severity === 'CRITICAL' ? '#F25C75' : j.severity === 'HIGH' ? '#F2A65A' : '#F2D14D'} color="transparent" weight={0} fillOpacity={0.5}>
          <Popup><div style={{ color: '#F25C75', fontWeight: 'bold' }}>🚗 {j.name}</div><div style={{fontSize:11, color:'#aaa'}}>Delay: ~{j.delay_min} min</div></Popup>
        </CircleMarker>
      ))}

      {layers.majorHighwayProjects && MAJOR_HIGHWAY_PROJECTS.map((h, i) => (
        <Polyline key={`hwproj-${i}`} positions={h.coords} weight={3} color={h.status === 'operational' ? '#4DE6A1' : h.status === 'under-construction' ? '#F2D14D' : '#8B8B8B'} dashArray="8,6" opacity={0.6}>
          <Popup><div style={{ color: '#F2D14D', fontWeight: 'bold' }}>🛣️ {h.name}</div><div style={{fontSize:11, color:'#aaa'}}>{h.status}</div></Popup>
        </Polyline>
      ))}

      {layers.sludgePipelines && SLUDGE_PIPELINES.map((pipe, i) => (
        <Polyline key={`sludge-${i}`} positions={pipe} weight={2} color="#8B6914" dashArray="4,4" opacity={0.5}>
          <Popup><div style={{ color: '#8B6914', fontWeight: 'bold' }}>🏭 Sludge Pipeline</div></Popup>
        </Polyline>
      ))}

      {layers.slurryPipelines && SLURRY_PIPELINES.map((s, i) => (
        <Polyline key={`slurry-${i}`} positions={s.coords} weight={2} color="#A0522D" dashArray="6,4" opacity={0.5}>
          <Popup><div style={{ color: '#A0522D', fontWeight: 'bold' }}>⛏️ {s.name}</div><div style={{fontSize:11, color:'#aaa'}}>{s.material}</div></Popup>
        </Polyline>
      ))}

      {layers.spacePorts && SPACE_PORTS.map((s, i) => (
        <CircleMarker key={`space-${i}`} center={[s.lat, s.lng]} radius={9} fillColor="#E8E8E8" color="#E8E8E8" weight={2} fillOpacity={0.7}>
          <Popup><div style={{ color: '#E8E8E8', fontWeight: 'bold' }}>🚀 {s.name}</div><div style={{fontSize:11, color:'#aaa'}}>{s.org} — {s.desc}</div></Popup>
        </CircleMarker>
      ))}

      {layers.intelHotspots && INTEL_HOTSPOTS.map((h, i) => (
        <CircleMarker key={`intel-${i}`} center={[h.lat, h.lng]} radius={12} fillColor={h.severity === 'CRITICAL' ? '#F25C75' : '#F2A65A'} color="transparent" weight={0} fillOpacity={0.35}>
          <Popup><div style={{ color: '#F25C75', fontWeight: 'bold' }}>🕵️ {h.name}</div><div style={{fontSize:11, color:'#aaa'}}>{h.type} — {h.severity}</div></Popup>
        </CircleMarker>
      ))}

      {layers.aviationHubs && AVIATION_HUBS.map((a, i) => (
        <CircleMarker key={`avia-${i}`} center={[a.lat, a.lng]} radius={8} fillColor="#87CEEB" color="#87CEEB" weight={1} fillOpacity={0.6}>
          <Popup><div style={{ color: '#87CEEB', fontWeight: 'bold' }}>✈️ {a.name} ({a.code})</div><div style={{fontSize:11, color:'#aaa'}}>{a.type}</div></Popup>
        </CircleMarker>
      ))}

      {layers.militaryActivity && MILITARY_ACTIVITY.map((m, i) => (
        <CircleMarker key={`milact-${i}`} center={[m.lat, m.lng]} radius={10} fillColor="#FF6B6B" color="#FF6B6B" weight={2} fillOpacity={0.5}>
          <Popup><div style={{ color: '#FF6B6B', fontWeight: 'bold' }}>🎖️ {m.name}</div><div style={{fontSize:11, color:'#aaa'}}>{m.branch} — {m.type}</div></Popup>
        </CircleMarker>
      ))}

      {layers.displacementFlows && DISPLACEMENT_FLOWS.map((d, i) => (
        <Polyline key={`disp-${i}`} positions={d.coords} weight={2} color="#DA70D6" dashArray="6,6" opacity={0.5}>
          <Popup><div style={{ color: '#DA70D6', fontWeight: 'bold' }}>🚶 {d.name}</div><div style={{fontSize:11, color:'#aaa'}}>{d.cause}</div></Popup>
        </Polyline>
      ))}

      {layers.strategicWaterways && STRATEGIC_WATERWAYS.map((w, i) => (
        <Polyline key={`stratwater-${i}`} positions={w.coords} weight={2} color="#4682B4" dashArray="8,4" opacity={0.6}>
          <Popup><div style={{ color: '#4682B4', fontWeight: 'bold' }}>🚢 {w.name}</div><div style={{fontSize:11, color:'#aaa'}}>{w.type} waterway</div></Popup>
        </Polyline>
      ))}

      {layers.naturalEvents && NATURAL_EVENTS.map((n, i) => (
        <CircleMarker key={`natev-${i}`} center={[n.lat, n.lng]} radius={14} fillColor={n.severity === 'CRITICAL' ? '#F25C75' : n.severity === 'HIGH' ? '#F2A65A' : '#F2D14D'} color="transparent" weight={0} fillOpacity={0.35}>
          <Popup><div style={{ color: '#F2A65A', fontWeight: 'bold' }}>🌍 {n.name}</div><div style={{fontSize:11, color:'#aaa'}}>{n.type} — {n.severity}</div></Popup>
        </CircleMarker>
      ))}

      {layers.cyberThreats && CYBER_THREATS.map((c, i) => (
        <CircleMarker key={`cyber-${i}`} center={[c.lat, c.lng]} radius={10} fillColor="#FF4500" color="#FF4500" weight={2} fillOpacity={0.5}>
          <Popup><div style={{ color: '#FF4500', fontWeight: 'bold' }}>💻 {c.name}</div><div style={{fontSize:11, color:'#aaa'}}>{c.type} — {c.severity}</div></Popup>
        </CircleMarker>
      ))}

      {layers.internetOutages && INTERNET_OUTAGES.map((o, i) => (
        <CircleMarker key={`outage-${i}`} center={[o.lat, o.lng]} radius={12} fillColor="#696969" color="#696969" weight={2} fillOpacity={0.5}>
          <Popup><div style={{ color: '#696969', fontWeight: 'bold' }}>📡 {o.name}</div><div style={{fontSize:11, color:'#aaa'}}>{o.isp} — {o.severity}</div></Popup>
        </CircleMarker>
      ))}

      {layers.criticalMinerals && CRITICAL_MINERALS.map((m, i) => (
        <CircleMarker key={`mineral-${i}`} center={[m.lat, m.lng]} radius={8} fillColor="#DAA520" color="#DAA520" weight={1} fillOpacity={0.6}>
          <Popup><div style={{ color: '#DAA520', fontWeight: 'bold' }}>⛏️ {m.name}</div><div style={{fontSize:11, color:'#aaa'}}>{m.mineral} — {m.status}</div></Popup>
        </CircleMarker>
      ))}

      {layers.fires && FIRES.map((f, i) => (
        <CircleMarker key={`fire-${i}`} center={[f.lat, f.lng]} radius={12} fillColor={f.severity === 'CRITICAL' ? '#FF2400' : '#FF6347'} color="transparent" weight={0} fillOpacity={0.5}>
          <Popup><div style={{ color: '#FF2400', fontWeight: 'bold' }}>🔥 {f.name}</div><div style={{fontSize:11, color:'#aaa'}}>{f.type} — {f.severity}</div></Popup>
        </CircleMarker>
      ))}

      {layers.weatherAlerts && WEATHER_ALERTS.map((w, i) => (
        <CircleMarker key={`weather-${i}`} center={[w.lat, w.lng]} radius={14} fillColor={w.severity === 'CRITICAL' ? '#F25C75' : w.severity === 'HIGH' ? '#F2A65A' : '#87CEEB'} color="transparent" weight={0} fillOpacity={0.3}>
          <Popup><div style={{ color: '#F2A65A', fontWeight: 'bold' }}>🌤️ {w.name}</div><div style={{fontSize:11, color:'#aaa'}}>{w.type} — {w.severity}</div></Popup>
        </CircleMarker>
      ))}

      {/* ── PHASE 12: WAR ZONES ──────────────────────────── */}
      {layers.warZones && WAR_ZONES_POLYGONS.map((zone, i) => (
        <Polygon 
          key={`warzone-${i}`} 
          positions={zone.coords} 
          pathOptions={{ 
            color: zone.color, 
            fillColor: zone.color, 
            fillOpacity: 0.25, 
            weight: 2 
          }}
        >
           <Popup>
             <div style={{ color: zone.color, fontWeight: 'bold' }}>🗺️ {zone.name}</div>
             <div style={{fontSize:11, color:'#aaa'}}>Strategic Regional Assessment</div>
           </Popup>
        </Polygon>
      ))}

      {/* ── COUNTRY CLICK OVERLAYS ───────────────────── */}
      {Object.keys(COUNTRY_INTEL).map((key) => {
        const centers: Record<string, [number, number]> = {
          India: [20.59, 78.96],
          Pakistan: [30.38, 69.34],
          China: [35.86, 104.19],
        };
        if (!centers[key]) return null;
        return (
          <Marker
            key={`country-${key}`}
            position={centers[key]}
            icon={L.divIcon({
              className: "",
              iconSize: [1, 1],
              html: `<div></div>`,
            })}
            eventHandlers={{ click: () => onCountryClick(key) }}
          />
        );
      })}
    </MapContainer>
  );
}
