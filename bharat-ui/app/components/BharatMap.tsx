"use client";
import dynamic from "next/dynamic";

const BharatMapInner = dynamic(() => import("./BharatMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0A0A0A]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#00FFFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[#00FFFF] font-mono text-sm tracking-widest">INITIALIZING MAP</p>
      </div>
    </div>
  ),
});

export default BharatMapInner;
