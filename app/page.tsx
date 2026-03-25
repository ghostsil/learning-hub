"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Activity, Zap, Target, Globe, Lock } from 'lucide-react';

export default function CommandCenter() {
  // Safe placeholder logic for deployment
  const [time, setTime] = useState("18:35");
  const [weather, setWeather] = useState({ city: "Lagos", temp: "31°C" });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-blue-500 p-4 font-mono uppercase tracking-widest relative overflow-hidden">
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)', size: '40px 40px' }} />

      {/* HEADER SECTION */}
      <header className="border-b-2 border-blue-900 pb-4 mb-8 flex justify-between items-center relative z-10">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-blue-400">COMMAND CENTER v2.1</h1>
          <p className="text-xs opacity-50">Authorized Personnel: ghostsil</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-green-500">
            <Shield size={16} />
            <span className="text-sm">SYSTEMS: ACTIVE</span>
          </div>
          <p className="text-[10px] opacity-40 italic">Link: learning-hub.vercel.app</p>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">

        {/* MISSION OBJECTIVES */}
        <div className="col-span-2 border-2 border-blue-900 bg-blue-950/20 p-6 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-blue-800 pb-2">
            <Target className="text-blue-400" />
            <h2 className="text-xl font-bold">Priority Mission Objectives</h2>
          </div>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 bg-blue-900/10 p-3 border-l-4 border-blue-500">
              <input type="checkbox" className="w-5 h-5 accent-blue-500" />
              <span>Calisthenics & Weight Lifting Session</span>
            </li>
            <li className="flex items-center gap-4 bg-blue-900/10 p-3 border-l-4 border-blue-500">
              <input type="checkbox" className="w-5 h-5 accent-blue-500" />
              <span>YouTube Channel Content Strategy (Automation Focus)</span>
            </li>
            <li className="flex items-center gap-4 bg-blue-900/10 p-3 border-l-4 border-blue-500">
              <input type="checkbox" className="w-5 h-5 accent-blue-500" />
              <span>Canton Fair Logistics Planning</span>
            </li>
          </ul>
        </div>

        {/* SIDEBAR STATS */}
        <div className="space-y-6">
          <div className="border-2 border-blue-900 bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold">Biometric Data</h3>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-blue-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-[75%] animate-pulse" />
              </div>
              <p className="text-[10px] text-right">Energy: 75%</p>
            </div>
          </div>

          <div className="border-2 border-blue-900 bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold">Tech Stack Sync</h3>
            </div>
            <p className="text-[10px] leading-relaxed opacity-70">
              Environment: Antigravity<br />
              Core: Next.js + Tailwind<br />
              Host: Vercel Cloud
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER STATS */}
      <footer className="mt-8 pt-4 border-t-2 border-blue-900 flex justify-between items-end opacity-80 text-[10px]">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-blue-800">Location Delta</span>
            <span className="text-blue-400">SEC: {weather.city}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-blue-800">Current Time</span>
            <span className="text-blue-400">{time}</span>
          </div>
        </div>
        <div className="text-right flex items-center gap-2">
          <Lock size={12} className="text-green-500" />
          <span>Persistence: Active</span>
        </div>
      </footer>
    </main>
  );
}