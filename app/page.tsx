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
    <main className="min-h-screen bg-black text-blue-500 p-6 font-mono uppercase tracking-widest">
      {/* HEADER */}
      <div className="border-b-2 border-blue-900 pb-4 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic text-blue-400">COMMAND CENTER v2.2</h1>
          <p className="text-[10px] opacity-50">STATION: LAGOS HUB | USER: ghostsil</p>
        </div>
        <div className="flex items-center gap-2 text-green-500 text-xs border border-green-500/30 p-1 px-3 rounded">
          <span>🛡️ SYSTEM_READY</span>
        </div>
      </div>

      {/* MISSION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 border border-blue-800 bg-blue-950/10 p-6 rounded">
          <div className="flex items-center gap-2 mb-6 border-b border-blue-900 pb-2">
            <span className="text-xl">🎯</span>
            <h2 className="text-lg font-bold">OPERATIONAL_GOALS</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-900/10 border-l-2 border-blue-500">
              <div className="w-4 h-4 border border-blue-500 rounded-sm" />
              <span className="text-sm">FITNESS: WEIGHTS & CALISTHENICS</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-900/10 border-l-2 border-blue-500">
              <div className="w-4 h-4 border border-blue-500 rounded-sm" />
              <span className="text-sm">YOUTUBE: AUTOMATION CONTENT</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-900/10 border-l-2 border-blue-500">
              <div className="w-4 h-4 border border-blue-500 rounded-sm" />
              <span className="text-sm">LOGISTICS: CANTON FAIR 2026</span>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          <div className="border border-blue-900 p-4 bg-blue-950/10 rounded">
            <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold">
              <span>📈 BIOMETRICS</span>
            </div>
            <div className="w-full h-1.5 bg-blue-900 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full w-3/4 animate-pulse" />
            </div>
          </div>
          <div className="border border-blue-900 p-4 bg-blue-950/10 rounded">
            <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-bold">
              <span>⚡ HARDWARE_LINK</span>
            </div>
            <p className="text-[10px] opacity-60">HUB: GOOGLE PIXEL<br />ENGINE: ANTIGRAVITY</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-6 left-6 right-6 flex justify-between items-end border-t border-blue-900 pt-4 text-[10px]">
        <div className="flex gap-8">
          <div>
            <p className="text-blue-800">COORDINATES</p>
            <p className="text-blue-400">LAGOS, NIGERIA // 31°C</p>
          </div>
          <div>
            <p className="text-blue-800">TEMPORAL_SYNC</p>
            <p className="text-blue-400">{isClient ? time : "SYNCING..."}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-green-700">
          <span>🔒 ENCRYPTED_SESSION</span>
        </div>
      </div>
    </main>
  );
}