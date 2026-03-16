"use client";
import { useState } from "react";
import { Layers, ChevronDown, ChevronUp } from "lucide-react";
import type { LayerConfig } from "./BharatMapInner";

const LAYER_GROUPS = [
  {
    label: "GEOPOLITICAL",
    color: "#F25C75",
    items: [
      { key: "warZones", label: "WAR ZONES", desc: "Regional conflict overlays", emoji: "🗺️" },
      { key: "conflictZones", label: "BORDER CONFLICTS", desc: "LoC, LAC, disputed borders", emoji: "⚔️" },
      { key: "persistentConflictZones", label: "INTERNAL CONFLICTS", desc: "Insurgency & militancy", emoji: "⚠️" },
      { key: "influenceCircles", label: "INFLUENCE RADII", desc: "Strategic command zones", emoji: "◯" },
      { key: "politicalZones", label: "POLITICAL ZONES", desc: "Regional stability", emoji: "🗳️" },
      { key: "protestHotspots", label: "LIVE PROTESTS", desc: "Active disruption", emoji: "🪧" },
      { key: "studentProtests", label: "STUDENT PROTESTS", desc: "Campus activism", emoji: "📢" },
      { key: "displacementFlows", label: "DISPLACEMENT FLOWS", desc: "Refugee & IDP corridors", emoji: "🚶" },
    ],
  },
  {
    label: "CITIES & EDUCATION",
    color: "#4DD2D2",
    items: [
      { key: "cities", label: "MAJOR CITIES", desc: "Tier-1 metropolitan", emoji: "🏙" },
      { key: "techCenters", label: "TECH CENTERS", desc: "Tier-2 tech hubs", emoji: "💻" },
      { key: "universities", label: "HACKATHON HUBS", desc: "IITs, IISc, BITS", emoji: "🎓" },
      { key: "govColleges", label: "GOV COLLEGES", desc: "Central & state unis", emoji: "🏛️" },
      { key: "incubationCenters", label: "INCUBATION CENTERS", desc: "Startup incubators", emoji: "🚀" },
      { key: "aqi", label: "AQI OVERLAY", desc: "Real-time air quality", emoji: "💨" },
    ],
  },
  {
    label: "MILITARY & DEFENSE",
    color: "#FF9933",
    items: [
      { key: "militaryBases", label: "MILITARY BASES", desc: "Tri-nation bases", emoji: "▲" },
      { key: "militaryActivity", label: "ACTIVE OPERATIONS", desc: "Forward bases & exercises", emoji: "🎖️" },
      { key: "nuclearSites", label: "NUCLEAR SITES", desc: "Plants & weapons stores", emoji: "☢️" },
      { key: "terrorIncidents", label: "SECURITY INCIDENTS", desc: "Critical events", emoji: "💥" },
      { key: "spacePorts", label: "SPACE PORTS", desc: "ISRO/DRDO launch sites", emoji: "🚀" },
    ],
  },
  {
    label: "INTELLIGENCE & CYBER",
    color: "#FF4500",
    items: [
      { key: "intelHotspots", label: "INTEL HOTSPOTS", desc: "Border & naval intel", emoji: "🕵️" },
      { key: "cyberThreats", label: "CYBER THREATS", desc: "APT, ransomware, breaches", emoji: "💻" },
      { key: "internetOutages", label: "INTERNET OUTAGES", desc: "ISP shutdowns & blackouts", emoji: "📡" },
    ],
  },
  {
    label: "TRANSPORT",
    color: "#6BC5A0",
    items: [
      { key: "highways", label: "HIGHWAYS", desc: "Live congestion overlay", emoji: "🛣" },
      { key: "majorHighwayProjects", label: "HIGHWAY PROJECTS", desc: "Under construction", emoji: "🚧" },
      { key: "railwayLines", label: "RAILWAY LINES", desc: "Major rail corridors", emoji: "🚂" },
      { key: "trafficJams", label: "TRAFFIC JAMS", desc: "Real-time congestion", emoji: "🚗" },
      { key: "airwayCorridors", label: "AIR CORRIDORS", desc: "Flight paths", emoji: "✈️" },
      { key: "aviationHubs", label: "AVIATION HUBS", desc: "Airports & airfields", emoji: "🛬" },
    ],
  },
  {
    label: "MARITIME & PIPELINES",
    color: "#F2A65A",
    items: [
      { key: "ports", label: "PORTS", desc: "Indian sea ports", emoji: "⚓" },
      { key: "majorPorts", label: "MAJOR PORTS (TRADE)", desc: "95% trade volume", emoji: "🚢" },
      { key: "waterways", label: "WATERWAYS (CHOKE)", desc: "Chokepoints & straits", emoji: "🌊" },
      { key: "strategicWaterways", label: "STRATEGIC WATERWAYS", desc: "Inland navigation", emoji: "🚢" },
      { key: "riverTradeRoutes", label: "RIVER TRADE", desc: "Interstate routes", emoji: "💧" },
      { key: "underseaCables", label: "UNDERSEA CABLES", desc: "Fiber optic backbone", emoji: "〰" },
      { key: "underseaPipelines", label: "UNDERSEA PIPELINES", desc: "Gas infrastructure", emoji: "🚰" },
      { key: "overlandPipelines", label: "OVERLAND PIPELINES", desc: "HVJ energy network", emoji: "🛢️" },
      { key: "sludgePipelines", label: "SLUDGE PIPELINES", desc: "Waste infrastructure", emoji: "🏭" },
      { key: "slurryPipelines", label: "SLURRY PIPELINES", desc: "Mineral transport", emoji: "⛏️" },
    ],
  },
  {
    label: "NATURAL & ENVIRONMENT",
    color: "#87CEEB",
    items: [
      { key: "naturalEvents", label: "NATURAL EVENTS", desc: "Floods, cyclones, quakes", emoji: "🌍" },
      { key: "fires", label: "FIRES", desc: "Wildfires & industrial", emoji: "🔥" },
      { key: "weatherAlerts", label: "WEATHER ALERTS", desc: "Heat waves, storms", emoji: "🌤️" },
      { key: "criticalMinerals", label: "CRITICAL MINERALS", desc: "Mining & resource sites", emoji: "⛏️" },
    ],
  },
  {
    label: "POLICY & RESEARCH",
    color: "#C3AED6",
    items: [
      { key: "predictions", label: "PREDICTIONS", desc: "Think tank forecasts", emoji: "🔮" },
      { key: "tradePolicies", label: "TRADE POLICIES", desc: "SEZs & free trade zones", emoji: "📦" },
      { key: "thinkTanks", label: "THINK TANKS", desc: "Policy research orgs", emoji: "🧠" },
    ],
  },
] as const;

interface Props {
  layers: LayerConfig;
  onToggle: (key: keyof LayerConfig) => void;
  onToggleAll: (state: boolean) => void;
}

export default function LayerControl({ layers, onToggle, onToggleAll }: Props) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<string[]>(["GEOPOLITICAL", "CITIES & TECH"]);

  const toggleGroup = (label: string) => {
    setExpanded(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  const activeCount = Object.values(layers).filter(Boolean).length;
  const totalCount = LAYER_GROUPS.reduce((acc, g) => acc + g.items.length, 0);
  const allActive = activeCount === totalCount;

  return (
    <div className="glass-panel w-56 overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Layers size={13} className="text-cyan-DEFAULT" style={{ color: "#4DD2D2" }} />
          <span className="text-xs font-mono font-bold tracking-widest text-white/80">LAYERS</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(77,210,210,0.1)", color: "#4DD2D2", border: "1px solid rgba(77,210,210,0.2)" }}>
            {activeCount}/{totalCount}
          </span>
          {open ? <ChevronUp size={12} className="text-white/40 ml-1" /> : <ChevronDown size={12} className="text-white/40 ml-1" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleAll(!allActive); }}
          className="text-[9px] font-mono font-bold px-2 py-1 rounded transition-colors"
          style={{
            background: allActive ? "rgba(242,92,117,0.15)" : "rgba(77,230,161,0.15)",
            color: allActive ? "#F25C75" : "#4DE6A1",
            border: `1px solid ${allActive ? "rgba(242,92,117,0.3)" : "rgba(77,230,161,0.3)"}`
          }}
        >
          {allActive ? "HIDE ALL" : "SHOW ALL"}
        </button>
      </div>

      {open && (
        <div className="max-h-[70vh] overflow-y-auto">
          {LAYER_GROUPS.map(group => {
            const isExpanded = expanded.includes(group.label);
            return (
              <div key={group.label} className="border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-white/5 transition-colors"
                >
                  <span className="text-[9px] font-mono font-bold tracking-widest" style={{ color: group.color }}>
                    {group.label}
                  </span>
                  {isExpanded ? <ChevronUp size={10} className="text-white/30" /> : <ChevronDown size={10} className="text-white/30" />}
                </button>

                {isExpanded && group.items.map(item => {
                  const active = layers[item.key as keyof LayerConfig];
                  return (
                    <button
                      key={item.key}
                      onClick={() => onToggle(item.key as keyof LayerConfig)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left transition-all duration-200 hover:bg-white/5"
                    >
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0 transition-all duration-200"
                        style={{
                          background: active ? group.color : "transparent",
                          border: `1px solid ${active ? group.color : "rgba(255,255,255,0.15)"}`,
                          boxShadow: active ? `0 0 6px ${group.color}66` : "none",
                        }}
                      />
                      <span className="text-[10px]">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono font-semibold truncate" style={{ color: active ? "#fff" : "#555" }}>
                          {item.label}
                        </div>
                        <div className="text-[9px] truncate" style={{ color: active ? "#666" : "#333" }}>{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
