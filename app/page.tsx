"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Activity, Zap, Target, Lock, CloudSun, Plus, Flame, Clock } from 'lucide-react';

export default function CommandCenter() {
  const [time, setTime] = useState("00:00:00");
  const [isClient, setIsClient] = useState(false);
  const [weather, setWeather] = useState({ temp: "--", humidity: "--" });
  const [gymLogs, setGymLogs] = useState(["Chest Day: 10x3 Reps", "5km Run Complete"]);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);

    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current=temperature_2m,relative_humidity_2m');
        const data = await res.json();
        setWeather({ temp: Math.round(data.current.temperature_2m).toString(), humidity: data.current.relative_humidity_2m });
      } catch (err) { console.error(err); }
    };
    fetchWeather();
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-slate-200 p-4 font-sans relative overflow-x-hidden">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <header className="mb-8 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 uppercase">
              Command Center
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em]">OPERATOR: GHOSTSIL // ST-LGS</p>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-2 rounded-lg backdrop-blur-md">
            <Activity size={18} className="text-blue-400" />
          </div>
        </div>
      </header>

      <div className="space-y-6 pb-24">
        {/* ATMOSPHERIC BOX */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <CloudSun size={12} />
              <span className="text-[9px] font-bold">LAGOS_TEMP</span>
            </div>
            <p className="text-2xl font-light">{weather.temp}°<span className="text-blue-400 font-bold text-sm">C</span></p>
          </div>
          <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Clock size={12} />
              <span className="text-[9px] font-bold">LOCAL_TIME</span>
            </div>
            <p className="text-lg font-medium">{isClient ? time.split(' ')[0] : "--:--:--"}</p>
          </div>
        </section>

        {/* ACTIVE MISSIONS */}
        <section className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 flex items-center gap-2">
              <Target size={14} className="text-blue-500" /> ACTIVE_MISSIONS
            </h2>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">3 TOTAL</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Fitness: Weights & Calisthenics", color: "from-blue-500" },
              { label: "YouTube: Tech Automation", color: "from-cyan-500" },
              { label: "Logistics: Canton Fair 2026", color: "from-indigo-500" }
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] group active:scale-[0.98] transition-transform">
                <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${task.color} to-transparent`} />
                <span className="text-[13px] font-medium text-slate-300">{task.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FITNESS LOGS */}
        <section className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 flex items-center gap-2">
              <Flame size={14} className="text-orange-500" /> FITNESS_LOGS
            </h2>
            <button className="p-2 bg-blue-500 rounded-full active:scale-90 transition-transform">
              <Plus size={16} className="text-black" />
            </button>
          </div>
          <div className="space-y-2">
            {gymLogs.map((log, i) => (
              <p key={i} className="text-[11px] text-slate-500 font-mono border-l border-slate-800 pl-3 py-1 italic">
                {">"} {log}
              </p>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER BAR */}
      <footer className="fixed bottom-6 left-4 right-4 bg-slate-900/80 border border-white/10 backdrop-blur-2xl rounded-2xl p-4 flex justify-between items-center shadow-2xl z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Zap size={14} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold">UPLINK_STABLE</p>
            <p className="text-[8px] text-slate-500">6.5244° N, 3.3792° E</p>
          </div>
        </div>
        <Lock size={14} className="text-slate-600" />
      </footer>
    </main>
  );
}