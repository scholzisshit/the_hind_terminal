"use client";
import { X, Shield, Zap, Radio } from "lucide-react";
import { COUNTRY_INTEL } from "../lib/data";

interface Props {
  country: string;
  onClose: () => void;
}

const RISK_COLOR: Record<string, string> = {
  CRITICAL: "#F25C75", HIGH: "#F2A65A", WARNING: "#F2A65A",
  MODERATE: "#F2D14D", INFO: "#4DD2D2", LOW: "#4DE6A1", SAFE: "#4DE6A1",
};

function InstabilityBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}88` }} />
    </div>
  );
}

export default function CountryIntelPanel({ country, onClose }: Props) {
  const intel = COUNTRY_INTEL[country];
  if (!intel) return null;

  const instColor = intel.instability > 70 ? "#F25C75" : intel.instability > 40 ? "#F2A65A" : "#4DE6A1";
  const instLabel = intel.instability > 70 ? "ELEVATED" : intel.instability > 40 ? "MODERATE" : "STABLE";

  return (
    <div
      className="glass-panel flex flex-col overflow-hidden"
      style={{
        width: 280,
        height: "100%",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(10,10,12,0.95)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-2xl">{intel.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white">{intel.name}</div>
          <div className="text-[9px] font-mono text-white/30 tracking-widest">INTELLIGENCE BRIEF</div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X size={14} className="text-white/40" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ scrollbarWidth: "thin" }}>

        {/* Instability Index */}
        <div className="glass-panel rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-mono text-white/40 tracking-widest">INSTABILITY INDEX</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
              style={{ color: instColor, background: `${instColor}11`, border: `1px solid ${instColor}33` }}>
              {instLabel}
            </span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-mono font-bold" style={{ color: instColor }}>{intel.instability}</span>
            <span className="text-white/30 font-mono text-sm mb-1">/100</span>
          </div>
          <InstabilityBar pct={intel.instability} color={instColor} />
        </div>

        {/* Threat Breakdown */}
        <div className="glass-panel rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-[9px] font-mono text-white/40 tracking-widest mb-2">THREAT VECTORS</div>
          {[
            { label: "Threat", val: intel.threat, max: 100, color: "#F25C75" },
            { label: "Conflict", val: intel.conflict, max: 100, color: "#F2A65A" },
            { label: "Security", val: intel.security, max: 100, color: "#F2D14D" },
            { label: "Cyber", val: intel.cyber, max: 100, color: "#9A73E6" },
          ].map(({ label, val, max, color }) => (
            <div key={label} className="mb-2">
              <div className="flex justify-between text-[9px] font-mono mb-0.5">
                <span className="text-white/50">{label}</span>
                <span style={{ color }}>{val}</span>
              </div>
              <InstabilityBar pct={(val / max) * 100} color={color} />
            </div>
          ))}
        </div>

        {/* Active Signals */}
        <div className="glass-panel rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Radio size={10} style={{ color: "#4DE6A1" }} />
            <span className="text-[9px] font-mono text-white/40 tracking-widest">ACTIVE SIGNALS</span>
          </div>
          <div className="space-y-1">
            {intel.signals.map((sig, i) => {
              const col = RISK_COLOR[sig.severity] || "#4DD2D2";
              return (
                <div key={i} className="flex items-center gap-2 text-[10px]">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: col, boxShadow: `0 0 4px ${col}` }} />
                  <span style={{ color: col === "#4DD2D2" ? "#aaa" : col }}>{sig.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top News */}
        <div className="glass-panel rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-[9px] font-mono text-white/40 tracking-widest mb-2">TOP NEWS</div>
          <div className="space-y-2">
            {intel.news.map((n, i) => {
              const col = n.severity === "HIGH" ? "#F2A65A" : n.severity === "WARNING" ? "#F2D14D" : "#4DD2D2";
              return (
                <div key={i} className="border-b pb-2 last:border-b-0" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] font-mono px-1 rounded"
                      style={{ color: col, background: `${col}11`, border: `1px solid ${col}22` }}>
                      {n.severity}
                    </span>
                    <span className="text-[9px] font-mono text-white/25">{n.ago}</span>
                  </div>
                  <p className="text-[10px] text-white/65 leading-relaxed">{n.headline}</p>
                  <span className="text-[8px] font-mono text-white/25">{n.source}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Military Activity */}
        <div className="glass-panel rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={10} style={{ color: "#F2A65A" }} />
            <span className="text-[9px] font-mono text-white/40 tracking-widest">MILITARY ACTIVITY</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Own Flights", val: intel.military.ownFlights, color: "#4DE6A1" },
              { label: "Foreign Flights", val: intel.military.foreignFlights, color: "#F25C75" },
              { label: "Naval Vessels", val: intel.military.vessels, color: "#4DD2D2" },
              { label: "Active Alerts", val: intel.military.alerts, color: "#F2A65A" },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className="text-base font-mono font-bold" style={{ color }}>{val}</div>
                <div className="text-[8px] font-mono text-white/30">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Economic */}
        <div className="glass-panel rounded-xl p-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={10} style={{ color: "#F2D14D" }} />
            <span className="text-[9px] font-mono text-white/40 tracking-widest">ECONOMIC INDICATORS</span>
          </div>
          {intel.economy.sensex && (
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-white/40">BSE Sensex</span>
              <span style={{ color: "#4DE6A1" }}>₹{intel.economy.sensex}</span>
            </div>
          )}
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-white/40">GDP Momentum</span>
            <span style={{ color: "#4DE6A1" }}>{intel.economy.gdpMomentum}</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-white/40">Instability</span>
            <span style={{ color: instColor }}>{intel.economy.instabilityRegime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
