import Link from "next/link";
import { ArrowLeft, Map, Activity, Shield, TerminalSquare, AlertTriangle, Cpu } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#4DD2D2] selection:text-black font-sans overflow-x-hidden">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 flex items-center px-6 py-4 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-mono font-bold tracking-widest uppercase">Back to Dashboard</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex gap-1">
            {["#F2A65A", "#FFFFFF", "#138808"].map((c, i) => (
              <div key={i} className="w-0.5 h-4 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}88` }} />
            ))}
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white leading-none tracking-wider">BHARAT<span style={{ color: "#4DD2D2" }}>MONITOR</span></div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20 pb-40 space-y-32">
        
        {/* Header Section */}
        <section className="space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4DD2D2]/10 border border-[#4DD2D2]/20 text-[#4DD2D2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4DD2D2] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest">SYSTEM MANUAL v1.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
            Continental <br />
            <span className="font-semibold text-white text-shadow-glow">Intelligence.</span>
          </h1>
          <p className="text-xl text-white/40 max-w-2xl leading-relaxed">
            Bharat Monitor is a real-time, high-performance geospatial intelligence dashboard engineered for absolute situational awareness across India and South Asia.
          </p>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4DD2D2]/20 to-transparent flex items-center justify-center border border-[#4DD2D2]/20 group-hover:scale-110 transition-transform">
              <Map size={20} className="text-[#4DD2D2]" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">Geospatial Terrain Engine</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Propelled by an ultra-fast HTML5 Canvas rendering engine, visualizing 34 custom tracker layers including Conflict Zones, Space Ports, Cyber Threats, and Military Installations without browser stutter.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F2A65A]/20 to-transparent flex items-center justify-center border border-[#F2A65A]/20 group-hover:scale-110 transition-transform">
              <Activity size={20} className="text-[#F2A65A]" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">Live Financial Telemetry</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Streams SENSEX, NIFTY50, and BANKNIFTY data directly into the dashboard at a 1Hz refresh rate via a high-performance Rust WebSocket backend, tracking economic stability in real-time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9A73E6]/20 to-transparent flex items-center justify-center border border-[#9A73E6]/20 group-hover:scale-110 transition-transform">
              <TerminalSquare size={20} className="text-[#9A73E6]" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">Virtual CLI Integration</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Access the embedded dark-mode macOS terminal emulator from the right activity bar to execute live data calls like <code className="px-1 py-0.5 bg-black/40 rounded border border-white/10 text-[#4DD2D2]">curl rate.sx</code> for instantaneous cryptocurrency feeds.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F25C75]/20 to-transparent flex items-center justify-center border border-[#F25C75]/20 group-hover:scale-110 transition-transform">
              <Shield size={20} className="text-[#F25C75]" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">Modular Threat Modeling</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              The proprietary Country Intel Panel assesses national Instability Indices based on Threat, Conflict, Security, and Cyber vectors, powered by python AI-aggregators.
            </p>
          </div>

        </section>

        {/* Deep Dive Section */}
        <section className="space-y-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-light tracking-tight">Navigating the Dashboard</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#4DD2D2] to-transparent rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded shrink-0 bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono">01</div>
                <h4 className="font-semibold">VS Code Architecture</h4>
              </div>
              <p className="text-sm text-white/40 leading-relaxed pl-11">
                Use the extreme left and right Activity Bars to swap active panels. Click the currently active icon to completely hide the panel, maximizing your geographic field of view.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded shrink-0 bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono">02</div>
                <h4 className="font-semibold">Custom Viewports</h4>
              </div>
              <p className="text-sm text-white/40 leading-relaxed pl-11">
                Hover over the inner edges of any open panel to drag and resize it. Bounded between 200px and 800px, you can mold the dashboard to fit your exact analytical needs. Mobile users are automatically served dynamic floating popovers that avoid crushing the map.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded shrink-0 bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono">03</div>
                <h4 className="font-semibold">Intelligence Layering</h4>
              </div>
              <p className="text-sm text-white/40 leading-relaxed pl-11">
                Use the persistent Layer Control menu in the top-left of the map. Toggle individual datasets or use the global <code className="text-[#4DD2D2]">SHOW ALL</code> / <code className="text-[#F25C75]">HIDE ALL</code> switches to instantly filter signal from noise.
              </p>
            </div>

          </div>
        </section>

        {/* Architecture Diagram */}
        <section className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <Cpu size={24} className="text-white/40" />
            <h2 className="text-xl font-light tracking-tight">System Architecture</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[10px] font-mono font-bold text-[#F2A65A] mb-2 tracking-widest">LAYER ONE</div>
              <div className="font-semibold text-sm mb-1">bharat-ai</div>
              <div className="text-xs text-white/40">Python 3 FastAPI handling threat modeling & NLP feed synthesis on Port 8000.</div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[10px] font-mono font-bold text-[#4DE6A1] mb-2 tracking-widest">LAYER TWO</div>
              <div className="font-semibold text-sm mb-1">bharat-core</div>
              <div className="text-xs text-white/40">Rust Axum WebSocket server running parallel thread pools for 1Hz telemetry streaming on Port 8080.</div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-[#4DD2D2]/20">
              <div className="text-[10px] font-mono font-bold text-[#4DD2D2] mb-2 tracking-widest">LAYER THREE</div>
              <div className="font-semibold text-sm mb-1">bharat-ui</div>
              <div className="text-xs text-white/40">Next.js 14 React frontend orchestrating the visual interface and CartoDB Canvas mapping on Port 3000.</div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
