"use client";
import { useState, useCallback, useEffect } from "react";
import { Activity, Globe, Server, Shield, Settings, Bell, TerminalSquare, Database, Target } from "lucide-react";
import dynamic from "next/dynamic";
import TopBar from "./components/TopBar";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import CountryIntelPanel from "./components/CountryIntelPanel";
import LayerControl from "./components/LayerControl";
import AIChatPanel from "./components/AIChatPanel";
import AIFloatingButton from "./components/AIFloatingButton";
import { useTelemetry } from "./hooks/useTelemetry";
import type { LayerConfig } from "./components/BharatMapInner";

const BharatMap = dynamic(() => import("./components/BharatMap"), { ssr: false });

const DEFAULT_LAYERS: LayerConfig = {
  cities: false,
  techCenters: false,
  universities: false,
  conflictZones: false,
  militaryBases: false,
  nuclearSites: false,
  ports: false,
  underseaCables: false,
  influenceCircles: false,
  waterways: false,
  highways: false,
  aqi: false,
  // Phase 7 Trackers
  terrorIncidents: false,
  majorPorts: false,
  incubationCenters: false,
  riverTradeRoutes: false,
  politicalZones: false,
  protestHotspots: false,
  airwayCorridors: false,
  underseaPipelines: false,
  persistentConflictZones: false,
  overlandPipelines: false,
  // Phase 11 Trackers
  predictions: false,
  tradePolicies: false,
  studentProtests: false,
  govColleges: false,
  thinkTanks: false,
  railwayLines: false,
  trafficJams: false,
  majorHighwayProjects: false,
  sludgePipelines: false,
  slurryPipelines: false,
  spacePorts: false,
  intelHotspots: false,
  aviationHubs: false,
  militaryActivity: false,
  displacementFlows: false,
  strategicWaterways: false,
  naturalEvents: false,
  cyberThreats: false,
  internetOutages: false,
  criticalMinerals: false,
  fires: false,
  weatherAlerts: false,
  warZones: false,
};

export default function Home() {
  const { frame, history, alerts, connected } = useTelemetry();
  const [layers, setLayers] = useState<LayerConfig>(DEFAULT_LAYERS);
  const [activeCountry, setActiveCountry] = useState<string | null>("India");
  const [aiPanelOpen, setAiPanelOpen] = useState<boolean>(false);

  // VS Code style panel state
  const [leftTab, setLeftTab] = useState<string>("telemetry");
  const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(296);
  const [isResizingLeft, setIsResizingLeft] = useState(false);

  const [rightTab, setRightTab] = useState<string>("feed");
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(272);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // ── Responsive Logic ─────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Resizing Logic ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        // Left panel bounded between 200px and 600px
        setLeftPanelWidth(Math.min(Math.max(e.clientX - 48, 200), 600)); // offset by 48px left activity bar
      }
      if (isResizingRight) {
        // Right panel bounded between 200px and 600px
        const newWidth = window.innerWidth - e.clientX - 48; // offset by 48px right activity bar
        setRightPanelWidth(Math.min(Math.max(newWidth, 200), 800));
        if (rightTab === "terminal" && newWidth < 400) {
          return; // terminal prefers wide format
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto'; // Re-enable selection
    };

    if (isResizingLeft || isResizingRight) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, rightTab]);

  // Handle Terminal forced expansion
  useEffect(() => {
    if (rightTab === "terminal") {
      setRightPanelWidth(600);
    } else if (rightTab === "feed") {
      setRightPanelWidth(272); // return to normal feed width
    }
  }, [rightTab]);

  const handleLeftTabClick = useCallback((tab: string) => {
    if (leftTab === tab) setLeftPanelOpen(!leftPanelOpen);
    else { setLeftTab(tab); setLeftPanelOpen(true); }
  }, [leftTab, leftPanelOpen]);

  const handleRightTabClick = useCallback((tab: string) => {
    if (rightTab === tab) setRightPanelOpen(!rightPanelOpen);
    else { setRightTab(tab); setRightPanelOpen(true); }
  }, [rightTab, rightPanelOpen]);

  const toggleLayer = useCallback((key: keyof LayerConfig) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleToggleAll = useCallback((state: boolean) => {
    setLayers(Object.keys(DEFAULT_LAYERS).reduce((acc, key) => {
      acc[key as keyof LayerConfig] = state;
      return acc;
    }, {} as LayerConfig));
  }, []);

  const handleCountryClick = useCallback((country: string) => {
    setActiveCountry(prev => prev === country ? null : country);
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden" style={{ background: "#0A0A0A" }}>
      {/* Top Bar */}
      <TopBar frame={frame} connected={connected} />

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left Activity Bar */}
        <div className="w-12 bg-[#0A0A0A] border-r border-white/5 flex flex-col items-center py-4 z-[2000] flex-shrink-0 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            {[
              { id: "telemetry", icon: Activity, color: "#4DD2D2" },
              { id: "network", icon: Globe, color: "#fff" },
              { id: "nodes", icon: Server, color: "#fff" },
              { id: "security", icon: Shield, color: "#fff" }
            ].map(t => (
              <button key={t.id} onClick={() => handleLeftTabClick(t.id)} className={`p-2 rounded-lg transition-all ${leftTab === t.id && leftPanelOpen ? 'bg-white/10 opacity-100' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`} style={{ color: leftTab === t.id && leftPanelOpen ? t.color : "#fff" }}>
                <t.icon size={20} strokeWidth={1.5} />
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <button className="p-2 rounded-lg opacity-40 hover:opacity-100 hover:bg-white/5 transition-all text-white">
              <Settings size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Left Panel */}
        {leftPanelOpen && (
          <div
            className="flex-shrink-0 overflow-y-auto relative"
            style={isMobile ? {
              position: "absolute", zIndex: 3000, top: 0, bottom: 0, left: 48, width: "calc(100vw - 48px)",
              background: "rgba(10,10,14,0.95)", borderRight: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)",
            } : {
              width: leftPanelWidth,
              background: "rgba(10,10,14,0.6)",
              borderRight: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
              transition: isResizingLeft ? "none" : "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Drag Handle */}
            <div
              className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize z-50 hover:bg-white/10"
              onMouseDown={() => setIsResizingLeft(true)}
            />
            {leftTab === "telemetry" ? (
              <div className="p-3">
                <LeftPanel frame={frame} history={history} />
              </div>
            ) : (
              <div className="p-4 text-xs font-mono text-white/40 tracking-widest flex flex-col items-center justify-center h-full opacity-50">
                <div className="mb-4">[{leftTab.toUpperCase()} MODULE OFFLINE]</div>
                <div className="text-[10px] text-center">Awaiting data stream connection...</div>
              </div>
            )}
          </div>
        )}

        {/* Map + Overlay controls */}
        <div className="flex-1 relative overflow-hidden">

          {/* Background grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-20"
            style={{
              backgroundImage: "linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Map */}
          <div className="absolute inset-0 z-10">
            <BharatMap layers={layers} frame={frame} onCountryClick={handleCountryClick} />
          </div>

          {/* ── SOUTH ASIA VIGNETTE SYSTEM ──────────────────────────────
               Wider radius to cover South Asia.
               Layer 1: Soft backdrop blur
               Layer 2: Soft darkness gradient
          ───────────────────────────────────────────────────────────────── */}
          <div className="absolute inset-0 z-20 pointer-events-none select-none">

            {/* Light blur at edges (starts transparent up to ~55% radius, then blurs) */}
            <div style={{
              position: "absolute", inset: 0,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 0%, transparent 45%, rgba(0,0,0,0.5) 70%, black 100%)",
              maskImage: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 0%, transparent 45%, rgba(0,0,0,0.5) 70%, black 100%)",
            }} />

            {/* Softer darkness gradient — abyss fade at outer corners */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse 80% 75% at 50% 50%, transparent 0%, transparent 50%, rgba(10,10,14,0.1) 65%, rgba(10,10,14,0.4) 85%, rgba(10,10,14,0.7) 100%)",
            }} />
          </div>

          {/* Layer Control — top left of map */}
          <div className="absolute top-3 left-3 z-[1000]">
            <LayerControl layers={layers} onToggle={toggleLayer} onToggleAll={handleToggleAll} />
          </div>

          {/* Map legend / status strip — bottom of map */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[1000] flex items-center gap-4 px-4 py-2"
            style={{
              background: "rgba(10,10,14,0.92)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Legend items */}
            {[
              { label: "Conflict Zone", color: "#FF3355" },
              { label: "Influence Circle", color: "#00FFFF" },
              { label: "Tech City", color: "#00FFFF" },
              { label: "Finance Hub", color: "#FFD700" },
              { label: "Gov/Defense", color: "#FF9933" },
              { label: "Trade Center", color: "#00FF88" },
              { label: "Highway: Clear", color: "#00FF88" },
              { label: "Highway: Critical", color: "#FF3355" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}88` }} />
                <span className="text-[9px] font-mono text-white/40">{label}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/25">
                {frame.connected_clients} client{frame.connected_clients !== 1 ? "s" : ""} connected
              </span>
              <div className="h-3 w-px bg-white/10" />
              <span className="text-[9px] font-mono" style={{ color: "#FF9933" }}>
                {alerts.filter(a => a.severity === "CRITICAL").length} critical alerts
              </span>
            </div>
          </div>

          {/* Corner branding */}
          <div className="absolute top-3 right-3 z-[999] flex flex-col items-end gap-1 pointer-events-none">
            <div className="text-[8px] font-mono tracking-widest text-white/20">THE HIND v1.0</div>
            <div className="text-[8px] font-mono text-white/15">GEOSPATIAL INTELLIGENCE · INDIA</div>
          </div>

          {/* India Intel Toggle Button */}
          <div className="absolute top-16 right-3 z-[999]">
            <button
              onClick={() => handleCountryClick("India")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${activeCountry === "India"
                  ? 'bg-white/10 border-white/20 text-[#4DD2D2]'
                  : 'bg-black/40 border-white/5 text-white/40 hover:bg-white/5 hover:text-white'
                } backdrop-blur-md`}
            >
              <Target size={14} />
              <span className="text-[10px] font-mono font-bold tracking-widest">INDIA INTEL</span>
            </button>
          </div>

          {/* AI Floating Button */}
          <AIFloatingButton isOpen={aiPanelOpen} onClick={() => setAiPanelOpen(prev => !prev)} />
        </div>

        {/* Right Panel */}
        {rightPanelOpen && (
          <div
            className="flex-shrink-0 relative"
            style={isMobile ? {
              position: "absolute", zIndex: 3000, top: 0, bottom: 0, right: 48, width: "calc(100vw - 48px)",
              background: "rgba(10,10,14,0.95)", borderLeft: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(12px)",
              height: "100%", display: "flex", flexDirection: "column"
            } : {
              width: rightPanelWidth,
              background: "rgba(10,10,14,0.6)",
              borderLeft: "1px solid rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: isResizingRight ? "none" : "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Drag Handle */}
            <div
              className="absolute top-0 left-0 bottom-0 w-2 cursor-col-resize z-50 hover:bg-white/10"
              onMouseDown={() => setIsResizingRight(true)}
            />
            {rightTab === "feed" ? (
              <div className="p-3 w-full h-full">
                <RightPanel alerts={alerts} />
              </div>
            ) : rightTab === "terminal" ? (
              <div className="w-full h-full bg-[#1c1c1c] overflow-hidden flex flex-col">
                {/* Mac OS Terminal Header */}
                <div className="bg-[#2d2d2d] px-4 py-2 text-[11px] text-white/50 font-mono border-b border-black flex items-center justify-between shadow-md z-10 flex-shrink-0">
                  <span className="tracking-wide">bash — curl rate.sx</span>
                  <div className="flex gap-1.5 opacity-90">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-black/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-black/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-black/20"></div>
                  </div>
                </div>
                {/* Embedded curl equivalent */}
                <div className="flex-1 w-full bg-[#1c1c1c] p-2 relative">
                  <div className="absolute inset-0 bg-transparent pointer-events-none z-10 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)]"></div>
                  <iframe
                    src="https://rate.sx"
                    className="w-full h-[200%] transform origin-top-left"
                    style={{ border: "none", filter: "contrast(1.1) brightness(0.9)" }}
                    title="Terminal: rate.sx"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 text-xs font-mono text-white/40 tracking-widest flex flex-col items-center justify-center h-full opacity-50">
                <div className="mb-4">[{rightTab.toUpperCase()} DATABASE]</div>
                <div className="text-[10px] text-center">No active query session.</div>
              </div>
            )}
          </div>
        )}

        {/* Right Activity Bar */}
        <div className="w-12 bg-[#0A0A0A] border-l border-white/5 flex flex-col items-center py-4 z-[2000] flex-shrink-0">
          <div className="flex flex-col gap-4">
            {[
              { id: "feed", icon: Bell, color: "#F2A65A" },
              { id: "terminal", icon: TerminalSquare, color: "#fff" },
              { id: "database", icon: Database, color: "#fff" }
            ].map(t => (
              <button key={t.id} onClick={() => handleRightTabClick(t.id)} className={`p-2 rounded-lg transition-all ${rightTab === t.id && rightPanelOpen ? 'bg-white/10 opacity-100' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`} style={{ color: rightTab === t.id && rightPanelOpen ? t.color : "#fff" }}>
                <t.icon size={20} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Country Intel Slide-in Panel */}
        {activeCountry && (
          <div
            className="absolute top-0 bottom-0 z-[2000] flex items-stretch transition-all duration-300"
            style={{
              right: rightPanelOpen ? rightPanelWidth + 48 : 48, // offset by right panel + right activity bar
              pointerEvents: "none" // map interactions pass through container
            }}
          >
            <div style={{ pointerEvents: "all" }} className="h-full">
              <CountryIntelPanel country={activeCountry} onClose={() => setActiveCountry(null)} />
            </div>
          </div>
        )}
      </div>

      {/* AI Chat Panel — slides in from right, fixed overlay */}
      <AIChatPanel isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />
    </div>
  );
}
