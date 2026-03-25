"use client";

import React, { useState, useEffect } from 'react';

export default function CommandCenter() {
  const [time, setTime] = useState("00:00:00");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-blue-500 p-6 font-mono uppercase tracking-widest relative">
      {/* SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />

      {/* HEADER */}
      <div className="border-b-2 border-blue-900 pb-4 mb-8 flex justify-between items-center relative z-10">
        <div>
          <h1 className="text-3xl font-black italic text-blue-400 tracking-tighter">COMMAND CENTER v2.5</h1>
          <p className="text-[10px] opacity-50">STATION: LAGOS_HUB | OPERATOR: GHOSTSIL</p>
        </div>
        <div className="flex items-center gap-2 text-green-500 text-xs border border-green-500/30 p-2 rounded bg-green-500/5">
          <span>● SYSTEM_ONLINE</span>
        </div>
      </div>

      {/* MISSION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="col-span-2 border border-blue-800 bg-blue-950/10 p-6 rounded shadow-[0_0_15px_rgba(30,58,138,0.1)]">
          <div className="flex items-center gap-2 mb-6 border-b border-blue-900 pb-2">
            <span className="text-xl">🎯</span>
            <h2 className="text-lg font-bold">ACTIVE_MISSIONS</h2>
          </div>
          <div className="space-y-4">
            {[
              "FITNESS: CALISTHENICS & WEIGHTS",
              "YOUTUBE: TECH HISTORY AUTOMATION",
              "LOGISTICS: CANTON FAIR 2026"
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-blue-900/5 border-l-2 border-blue-500 hover:bg-blue-900/10 transition-colors">
                <div className="w-4 h-4 border border-blue-500 rounded-sm" />
                <span className="text-sm">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4 relative z-10">
          <div className="border border-blue-900 p-4 bg-blue-950/10 rounded">
            <div className="flex items-center gap-2 mb-2 text-blue-400 text-[10px] font-bold">
              <span>📊 BIOMETRIC_RESERVE</span>
            </div>
            <div className="w-full h-1.5 bg-blue-900 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full w-3/4 animate-pulse" />
            </div>
          </div>
          <div className="border border-blue-900 p-4 bg-blue-950/10 rounded">
            <div className="flex items-center gap-2 mb-2 text-blue-400 text-[10px] font-bold">
              <span>📡 UPLINK_STATUS</span>
            </div>
            <p className="text-[10px] opacity-60 leading-tight">
              HOST: VERCEL_EDGE<br />
              DEV: ANTIGRAVITY<br />
              SYNC: PIXEL_HUB
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-6 left-6 right-6 flex justify-between items-end border-t border-blue-900 pt-4 text-[10px] relative z-10">
        <div className="flex gap-8">
          <div>
            <p className="text-blue-800 font-bold">COORDINATES</p>
            <p className="text-blue-400">LAGOS_NG // 31°C</p>
          </div>
          <div>
            <p className="text-blue-800 font-bold">TEMPORAL_SYNC</p>
            <p className="text-blue-400">{isClient ? time : "CONNECTING..."}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-green-700 font-bold">
          <span>🔒 SECURE_SESSION</span>
        </div>
      </div>
    </main>
  );
}