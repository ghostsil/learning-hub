"use client";

import React, { useState, useEffect } from 'react';
// Simplified imports to ensure build stability
import { Shield, Activity, Zap, Target, Lock } from 'lucide-react';

export default function CommandCenter() {
  const [time, setTime] = useState("INITIALIZING...");
  const [weather] = useState({ city: "LAGOS", temp: "31°C" });

  // Real-time clock logic
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-blue-500 p-4 font-mono uppercase tracking-widest relative overflow-hidden">
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* HEADER */}
      <header className="border-b-2 border-blue-900 pb-4 mb-8 flex justify-between items-center relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-blue-400">COMMAND CENTER v2.1</h1>
          <p className="text-[10px] opacity-50">Personnel: ghostsil | Lagos Hub</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-green-500">
            <Shield size={16} />
            <span className="text-xs font-bold">SYSTEMS: ONLINE</span>
          </div>
        </div>
      </header>

      {/* OBJECTIVES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="col-span-2 border-2 border-blue-900 bg-blue-950/20 p-6 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-blue-800 pb-2">
            <Target className="text-blue-400" />
            <h2 className="text-xl font-bold italic">Mission Parameters</h2>
          </div>
          <ul className="space-y-4">
            {["Calisthenics & Weight Session", "YouTube Strategy: Tech History", "Canton Fair Planning"].map((task) => (
              <li key={task} className="flex items-center gap-4 bg-blue-900/10 p-3 border-l-4 border-blue-500">
                <input type="checkbox" className="w-5 h-5 accent-blue-500" />
                <span className="text-sm">{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* STATS SIDEBAR */}
        <div className="space-y-6">
          <div className="border-2 border-blue-900 bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <Activity size={18} />
              <h3 className="text-xs font-bold">BIOMETRICS</h3>
            </div>
            <div className="h-2 bg-blue-900 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 w-[75%] animate-pulse" />
            </div>
          </div>

          <div className="border-2 border-blue-900 bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Zap size={18} />
              <h3 className="text-xs font-bold">ENVIRONMENT</h3>
            </div>
            <p className="text-[10px] opacity-70">DEVICE: PIXEL HUB<br />ENV: ANTIGRAVITY</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-8 pt-4 border-t-2 border-blue-900 flex justify-between items-end opacity-80 text-[10px]">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-blue-800 font-bold">LOCATION</span>
            <span className="text-blue-400">{weather.city} // {weather.temp}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-blue-800 font-bold">TIMESTAMP</span>
            <span className="text-blue-400">{time}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <Lock size={12} />
          <span>ENCRYPTED</span>
        </div>
      </footer>
    </main>
  );
}