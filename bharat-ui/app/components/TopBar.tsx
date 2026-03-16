import { Wifi, WifiOff, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import type { TelemetryFrame } from "../hooks/useTelemetry";

interface Props {
  frame: TelemetryFrame;
  connected: boolean;
}

function fmt(v: number) { return v.toLocaleString("en-IN", { maximumFractionDigits: 2 }); }

export default function TopBar({ frame, connected }: Props) {
  const now = new Date();
  const istTime = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const istDate = now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  const tickers = [
    { label: "SENSEX", v: frame.sensex.value, ch: frame.sensex.change, color: "#4DD2D2" },
    { label: "NIFTY50", v: frame.nifty.value, ch: frame.nifty.change, color: "#F2A65A" },
    { label: "BANKNIFTY", v: frame.bank_nifty.value, ch: frame.bank_nifty.change, color: "#9A73E6" },
  ];

  return (
    <div
      className="flex items-center px-4 py-2 gap-4 flex-shrink-0"
      style={{
        background: "rgba(10,10,14,0.98)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        height: 48,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex gap-1">
          {["#F2A65A", "#FFFFFF", "#138808"].map((c, i) => (
            <div key={i} className="w-0.5 h-4 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}88` }} />
          ))}
        </div>
        <div>
          <div className="text-xs font-mono font-bold text-white leading-none tracking-wider">BHARAT<span style={{ color: "#4DD2D2" }}>MONITOR</span></div>
          <div className="text-[8px] font-mono text-white/30 tracking-widest leading-none mt-0.5">GEOSPATIAL INTEL PLATFORM</div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-white/10 flex-shrink-0" />

      {/* Tickers */}
      <div className="flex gap-4 flex-1 overflow-hidden">
        {tickers.map(({ label, v, ch, color }) => {
          const pos = ch >= 0;
          return (
            <div key={label} className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[9px] font-mono text-white/40">{label}</span>
              <span className="text-[11px] font-mono font-bold" style={{ color }}>{fmt(v)}</span>
              <span className="text-[9px] font-mono" style={{ color: pos ? "#4DE6A1" : "#F25C75" }}>
                {pos ? "▲" : "▼"}{Math.abs(ch).toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Grid alerts */}
        {frame.grids.some(g => g.risk_level === "CRITICAL") && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded"
            style={{ background: "rgba(242,92,117,0.1)", border: "1px solid rgba(242,92,117,0.3)" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#F25C75]" />
            <span className="text-[9px] font-mono" style={{ color: "#F25C75" }}>GRID CRITICAL</span>
          </div>
        )}

        {/* Seq number */}
        <div className="text-[9px] font-mono text-white/20">
          SEQ #{frame.sequence.toString().padStart(6, "0")}
        </div>

        {/* Clock */}
        <div className="flex items-center gap-1.5">
          <Clock size={10} className="text-white/30" />
          <div className="text-right">
            <div className="text-[10px] font-mono text-white/70 leading-none">{istTime}</div>
            <div className="text-[8px] font-mono text-white/30 leading-none mt-0.5">IST · {istDate}</div>
          </div>
        </div>

        {/* WS Status */}
        <div className="flex items-center gap-1.5">
          {connected ? (
            <><Wifi size={11} style={{ color: "#4DE6A1" }} /><span className="text-[9px] font-mono" style={{ color: "#4DE6A1" }}>LIVE</span></>
          ) : (
            <><WifiOff size={11} style={{ color: "#F2A65A" }} /><span className="text-[9px] font-mono" style={{ color: "#F2A65A" }}>SIM</span></>
          )}
        </div>

        {/* Guide Button */}
        <div className="h-4 w-px bg-white/10 mx-1 flex-shrink-0" />
        <Link 
          href="/guide"
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 transition-colors"
        >
          <BookOpen size={10} className="text-white/50" />
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#4DD2D2]">GUIDE</span>
        </Link>
      </div>
    </div>
  );
}
