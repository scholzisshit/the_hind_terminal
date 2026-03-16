"use client";
import { useRef, useEffect, useState } from "react";
import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-react";

type Alert = {
  id: string; severity: string; category: string;
  message: string; region: string; timestamp: string;
  lat?: number; lng?: number;
};

interface Props { alerts: Alert[] }

const SEV_CONFIG: Record<string, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
  CRITICAL: { color: "#F25C75", bg: "rgba(242,92,117,0.1)", border: "rgba(242,92,117,0.2)", Icon: AlertCircle },
  WARNING:  { color: "#F2A65A", bg: "rgba(242,166,90,0.1)", border: "rgba(242,166,90,0.2)", Icon: AlertTriangle },
  ALERT:    { color: "#F2D14D", bg: "rgba(242,209,77,0.1)", border: "rgba(242,209,77,0.2)", Icon: Bell },
  INFO:     { color: "#4DD2D2", bg: "rgba(77,210,210,0.06)", border: "rgba(77,210,210,0.15)", Icon: Info },
};

const CAT_EMOJI: Record<string, string> = {
  POWER: "⚡", AQI: "💨", TRAFFIC: "🛣", WEB3: "₿", CLOUD: "☁️",
  CLIMATE: "🌧", TECH: "💻", FINANCE: "📈", INFRA: "🏗", DEFAULT: "🔔",
};

function timeAgo(ts: string): string {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function RightPanel({ alerts }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const prevLength = useRef(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (alerts.length > prevLength.current && listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevLength.current = alerts.length;
  }, [alerts.length]);

  if (!hasMounted) {
    return (
      <div className="flex flex-col gap-2 w-80 h-full overflow-hidden">
        <div className="flex items-center gap-2 px-1">
          <div className="w-1.5 h-5 rounded-full" style={{ background: "#F25C75" }} />
          <span className="text-[10px] font-mono font-bold tracking-widest text-white/60">LIVE INTEL FEED</span>
        </div>
        <div className="flex-1 glass-panel rounded-xl flex items-center justify-center">
          <span className="text-[10px] font-mono text-white/20">INITIALIZING FEED...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-80 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-1.5 h-5 rounded-full" style={{ background: "#F25C75" }} />
        <span className="text-[10px] font-mono font-bold tracking-widest text-white/60">LIVE INTEL FEED</span>
      </div>

      {/* Stats bar */}
      <div className="glass-panel px-3 py-2 flex justify-between rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { label: "CRITICAL", count: alerts.filter(a => a.severity === "CRITICAL").length, color: "#F25C75" },
          { label: "WARNING", count: alerts.filter(a => a.severity === "WARNING").length, color: "#F2A65A" },
          { label: "INFO", count: alerts.filter(a => a.severity === "INFO").length, color: "#4DD2D2" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="text-base font-mono font-bold" style={{ color: s.color }}>{s.count}</div>
            <div className="text-[8px] font-mono text-white/30">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Alerts scroll */}
      <div ref={listRef} className="flex-1 overflow-y-auto space-y-1.5" style={{ scrollbarWidth: "thin" }}>
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-white/20">
            <Bell size={24} />
            <p className="text-[10px] font-mono mt-2">No active alerts</p>
          </div>
        )}
        {alerts.map((alert, i) => {
          const cfg = SEV_CONFIG[alert.severity] || SEV_CONFIG.INFO;
          const Icon = cfg.Icon;
          const emoji = CAT_EMOJI[alert.category] || CAT_EMOJI.DEFAULT;
          return (
            <div
              key={alert.id}
              className="glass-panel rounded-lg p-2.5 transition-all duration-300"
              style={{
                border: `1px solid ${cfg.border}`,
                background: cfg.bg,
                opacity: i > 20 ? 0.5 : 1,
                animation: i === 0 ? "fadeIn 0.4s ease" : "none",
              }}
            >
              <div className="flex items-start gap-2">
                <Icon size={11} style={{ color: cfg.color, flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                      {alert.severity}
                    </span>
                    <span className="text-[9px]">{emoji}</span>
                    <span className="text-[9px] font-mono text-white/30">{alert.category}</span>
                  </div>
                  <p className="text-[10px] text-white/75 leading-relaxed">{alert.message}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] font-mono text-white/30">{alert.region}</span>
                    <span className="text-[9px] font-mono text-white/20">{timeAgo(alert.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category filter quick pills */}
      <div className="glass-panel p-2 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="text-[9px] font-mono text-white/30 mb-1.5 tracking-widest">CATEGORIES</div>
        <div className="flex flex-wrap gap-1">
          {Object.entries(CAT_EMOJI).filter(([k]) => k !== "DEFAULT").map(([cat, em]) => (
            <div key={cat} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono"
              style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span>{em}</span><span>{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
