"use client";
import { useMemo } from "react";
import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import type { TelemetryFrame } from "../hooks/useTelemetry";

interface Props {
  frame: TelemetryFrame;
  history: { t: number; sensex: number; nifty: number; bankNifty: number }[];
}

const RISK_COLOR: Record<string, string> = {
  CRITICAL: "#F25C75", HIGH: "#F2A65A", MODERATE: "#F2D14D", LOW: "#4DE6A1",
};

function TickerCard({ data }: { data: TelemetryFrame["sensex"] }) {
  const pos = data.change >= 0;
  return (
    <div className="glass-panel p-3 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-mono font-bold tracking-widest text-white/50">{data.symbol}</span>
        <div className={`flex items-center gap-0.5 text-[10px] font-mono ${pos ? "text-emerald-DEFAULT" : "text-crimson-DEFAULT"}`}
          style={{ color: pos ? "#4DE6A1" : "#F25C75" }}>
          {pos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {pos ? "+" : ""}{data.change_pct.toFixed(2)}%
        </div>
      </div>
      <div className="text-lg font-mono font-bold text-white">
        {data.value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
      </div>
      <div className="text-[10px] font-mono mt-0.5" style={{ color: pos ? "#4DE6A1" : "#F25C75" }}>
        {pos ? "▲" : "▼"} {Math.abs(data.change).toFixed(2)}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number | string; color: string }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0D0F14EE", border: "1px solid #1A1D26", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontFamily: "monospace" }}>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {(+p.value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </div>
      ))}
    </div>
  );
};

export default function LeftPanel({ frame, history }: Props) {
  const chartData = useMemo(() =>
    history.slice(-60).map((h, i) => ({
      i,
      sensex: h.sensex,
      nifty: h.nifty,
      bankNifty: h.bankNifty,
    })),
  [history]);

  return (
    <div className="flex flex-col gap-2 w-72 h-full overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>

      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-1.5 h-5 rounded-full" style={{ background: "#4DD2D2" }} />
        <span className="text-[10px] font-mono font-bold tracking-widest text-white/60">FINANCIAL TELEMETRY</span>
        <div className="flex items-center gap-1 ml-auto">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-DEFAULT" style={{ background: "#4DE6A1" }} />
          <span className="text-[9px] font-mono text-white/30">LIVE 1Hz</span>
        </div>
      </div>

      {/* Tickers */}
      <div className="grid grid-cols-1 gap-2">
        <TickerCard data={frame.sensex} />
        <TickerCard data={frame.nifty} />
        <TickerCard data={frame.bank_nifty} />
      </div>

      {/* SENSEX Chart */}
      <div className="glass-panel p-3 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="text-[9px] font-mono text-white/40 mb-2 tracking-widest">SENSEX — 60 TICKS</div>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={chartData} margin={{ top: 2, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="sensexGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4DD2D2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4DD2D2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 8, fill: "#444", fontFamily: "monospace" }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="sensex" stroke="#4DD2D2" strokeWidth={1.5} fill="url(#sensexGrad)" dot={false} name="SENSEX" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* NIFTY + BANK NIFTY Chart */}
      <div className="glass-panel p-3 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="text-[9px] font-mono text-white/40 mb-2 tracking-widest">NIFTY50 & BANKNIFTY</div>
        <ResponsiveContainer width="100%" height={70}>
          <LineChart data={chartData} margin={{ top: 2, right: 0, left: -30, bottom: 0 }}>
            <YAxis yAxisId="n" domain={["auto","auto"]} tick={false} axisLine={false} />
            <YAxis yAxisId="b" orientation="right" domain={["auto","auto"]} tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line yAxisId="n" type="monotone" dataKey="nifty" stroke="#F2A65A" strokeWidth={1.5} dot={false} name="NIFTY" />
            <Line yAxisId="b" type="monotone" dataKey="bankNifty" stroke="#9A73E6" strokeWidth={1.5} dot={false} name="BANKNIFTY" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-3 mt-1">
          {[["NIFTY", "#F2A65A"], ["BANK", "#9A73E6"]].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ background: c }} />
              <span className="text-[9px] font-mono" style={{ color: c }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Power Grid Status */}
      <div className="glass-panel p-3 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={11} style={{ color: "#F2D14D" }} />
          <span className="text-[9px] font-mono text-white/40 tracking-widest">POWER GRID STATUS</span>
        </div>
        <div className="space-y-2">
          {frame.grids.map(grid => (
            <div key={grid.region_id}>
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[10px] font-mono text-white/60">{grid.region_name.replace(" Region","")}</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: RISK_COLOR[grid.risk_level] || "#aaa" }}>
                  {grid.load_pct.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${grid.load_pct}%`,
                    background: RISK_COLOR[grid.risk_level] || "#4DE6A1",
                  }}
                />
              </div>
              <div className="text-[9px] font-mono mt-0.5" style={{ color: RISK_COLOR[grid.risk_level] }}>
                {grid.saturation_prob.toFixed(0)}% saturation prob
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highway Congestion */}
      <div className="glass-panel p-3 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="text-[9px] font-mono text-white/40 mb-2 tracking-widest">HIGHWAY CONGESTION</div>
        <div className="space-y-1.5">
          {frame.highways.map(hw => {
            const pct = hw.congestion_index * 100;
            const col = pct > 80 ? "#F25C75" : pct > 60 ? "#F2A65A" : pct > 40 ? "#F2D14D" : "#4DE6A1";
            return (
              <div key={hw.id} className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-white/40 w-12 flex-shrink-0">{hw.id}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: col }} />
                </div>
                <span className="text-[9px] font-mono w-12 text-right" style={{ color: col }}>{hw.avg_speed_kmh.toFixed(0)} km/h</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
