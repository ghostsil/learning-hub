"use client";

import React, { useState, useEffect } from 'react';
import {
  Shield, Activity, Zap, Target, Lock, CloudSun,
  Plus, Flame, Clock, X, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';

export default function CommandCenter() {
  const [time, setTime] = useState("00:00:00");
  const [isClient, setIsClient] = useState(false);
  const [weather, setWeather] = useState({ temp: "--", humidity: "--" });

  // LOGIC: State for Fitness Logs
  const [gymLogs, setGymLogs] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLog, setNewLog] = useState("");

  // LOGIC: Mission Sub-sections
  const [openMission, setOpenMission] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('ghostsil_logs');
    if (saved) setGymLogs(JSON.parse(saved));

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

  const addLog = () => {
    if (newLog.trim()) {
      const updatedLogs = [newLog, ...gymLogs];
      setGymLogs(updatedLogs);
      localStorage.setItem('ghostsil_logs', JSON.stringify(updatedLogs));
      setNewLog("");
      setIsModalOpen(false);
    }
  };

  const deleteLog = (index: number) => {
    const updated = gymLogs.filter((_, i) => i !== index);
    setGymLogs(updated);
    localStorage.setItem('ghostsil_logs', JSON.stringify(updated));
  };

  const missions = [
    { id: 1, title: "Fitness: Weights & Calisthenics", details: "Current Focus: 5x5 Bench, Muscle-up progression." },
    { id: 2, title: "YouTube: Tech Automation", details: "Status: Scripting 'History of Autonomous Systems' video." },
    { id: 3, title: "Logistics: Canton Fair 2026", details: "Target: April 2026. Needs flight & visa roadmap." }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-slate-200 p-5 font-sans relative overflow-x-hidden selection:bg-blue-500/30">
      {/* HEADER */}
      <header className="mb-8 pt-2 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 uppercase leading-none">
            Command Center
          </h1>
          <p className="text-[9px] font-bold text-slate-500 tracking-[0.25em] mt-2 uppercase">OPERATOR: GHOSTSIL // ST-LGS</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl backdrop-blur-md">
          <Activity size={18} className="text-blue-400 animate-pulse" />
        </div>
      </header>

      {/* STATS ROW */}
      <section className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl shadow-inner">
          <p className="text-[8px] font-bold text-slate-600 mb-1 tracking-widest uppercase">Lagos_Temp</p>
          <p className="text-2xl font-light">{weather.temp}°<span className="text-blue-400 font-bold text-sm">C</span></p>
        </div>
        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl shadow-inner">
          <p className="text-[8px] font-bold text-slate-600 mb-1 tracking-widest uppercase">Local_Time</p>
          <p className="text-lg font-medium tracking-tight text-blue-100">{isClient ? time : "--:--:--"}</p>
        </div>
      </section>

      {/* FITNESS LOGS */}
      <section className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl mb-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <Flame size={14} className="text-orange-500" /> FITNESS_LOGS
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 bg-blue-500 flex items-center justify-center rounded-full active:scale-90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            <Plus size={20} className="text-black" />
          </button>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
          {gymLogs.length > 0 ? gymLogs.map((log, i) => (
            <div key={i} className="flex justify-between items-center group p-3 bg-white/[0.03] border border-white/5 rounded-xl hover:border-blue-500/30 transition-all">
              <span className="text-[12px] text-slate-300 font-mono italic flex-1 mr-2">{">"} {log}</span>
              <button
                onClick={() => deleteLog(i)}
                className="text-slate-600 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )) : (
            <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest">Waiting for input...</p>
            </div>
          )}
        </div>
      </section>

      {/* MISSIONS SECTION - WITH ACCORDIONS */}
      <section className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 shadow-xl">
        <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2 uppercase">
          <Target size={14} className="text-blue-500" /> Mission_Status
        </h2>
        <div className="space-y-4">
          {missions.map((mission) => (
            <div key={mission.id} className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
              <button
                onClick={() => setOpenMission(openMission === mission.id ? null : mission.id)}
                className="w-full p-4 flex items-center justify-between active:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${openMission === mission.id ? 'bg-blue-400 animate-pulse' : 'bg-slate-700'}`} />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-tight text-left">{mission.title}</span>
                </div>
                {openMission === mission.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openMission === mission.id && (
                <div className="px-4 pb-4 pt-0">
                  <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                    <p className="text-[11px] text-blue-300 leading-relaxed italic">{mission.details}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* INPUT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black tracking-widest text-blue-400 uppercase">Input_Log</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500"><X size={24} /></button>
            </div>
            <input
              autoFocus
              className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-6"
              placeholder="Ex: 50 Push-ups, 20kg Bicep Curls"
              value={newLog}
              onChange={(e) => setNewLog(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLog()}
            />
            <button
              onClick={addLog}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl active:scale-95 transition-all uppercase tracking-widest shadow-lg shadow-blue-600/20"
            >
              Commit to memory
            </button>
          </div>
        </div>
      )}

      {/* FOOTER BAR */}
      <footer className="mt-12 p-5 bg-slate-900/30 rounded-2xl border border-white/5 flex justify-between items-center opacity-60">
        <div className="flex items-center gap-2 text-[9px] font-black text-blue-400/80 tracking-widest">
          <Zap size={12} /> SECURE_CONNECTION_STABLE
        </div>
        <Lock size={12} className="text-slate-700" />
      </footer>
    </main>
  );
}