"use client";

import React, { useState, useEffect } from 'react';
import {
  Shield, Activity, Zap, Target, Lock, CloudSun,
  Plus, Flame, Clock, X, Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle
} from 'lucide-react';

export default function CommandCenter() {
  const [time, setTime] = useState("00:00:00");
  const [isClient, setIsClient] = useState(false);
  const [weather, setWeather] = useState({ temp: "--", humidity: "--" });

  const [gymLogs, setGymLogs] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLog, setNewLog] = useState("");
  const [openMission, setOpenMission] = useState<number | null>(null);

  // LOGIC: Mission Task Tracking
  const [missionTasks, setMissionTasks] = useState({
    1: [false, false, false], // Fitness
    2: [true, false, false],  // YouTube
    3: [false, false, false]  // Logistics
  });

  useEffect(() => {
    setIsClient(true);
    const savedLogs = localStorage.getItem('ghostsil_logs');
    const savedTasks = localStorage.getItem('ghostsil_tasks');
    if (savedLogs) setGymLogs(JSON.parse(savedLogs));
    if (savedTasks) setMissionTasks(JSON.parse(savedTasks));

    const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })), 1000);

    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current=temperature_2m');
        const data = await res.json();
        setWeather({ temp: Math.round(data.current.temperature_2m).toString(), humidity: "79" });
      } catch (err) { console.error(err); }
    };
    fetchWeather();
    return () => clearInterval(timer);
  }, []);

  const toggleTask = (missionId: number, taskIndex: number) => {
    const updatedTasks = { ...missionTasks };
    updatedTasks[missionId as keyof typeof missionTasks][taskIndex] = !updatedTasks[missionId as keyof typeof missionTasks][taskIndex];
    setMissionTasks(updatedTasks);
    localStorage.setItem('ghostsil_tasks', JSON.stringify(updatedTasks));
  };

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
    { id: 1, title: "Fitness: Weights & Calisthenics", tasks: ["Complete 5x5 Strength Set", "Handstand practice (15 mins)", "Post-workout recovery"] },
    { id: 2, title: "YouTube: Tech Automation", tasks: ["Research: Autonomous History", "Draft video script v1", "Edit opening sequence"] },
    { id: 3, title: "Logistics: Canton Fair 2026", tasks: ["Verify visa requirements", "Compare flight routes", "Draft sourcing list"] }
  ];

  return (
    <main className="min-h-screen bg-[#020202] text-slate-300 p-6 font-sans flex flex-col gap-6">
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center pt-2">
        <div className="space-y-1">
          <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
            Command Center
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">Operator: Ghostsil // ST-LGS</p>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
          <Activity size={18} className="text-cyan-400" />
        </div>
      </header>

      {/* TOP STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-3xl">
          <p className="text-[8px] font-bold text-slate-600 mb-1 tracking-widest uppercase flex items-center gap-1.5">
            <CloudSun size={10} /> Lagos_Temp
          </p>
          <p className="text-2xl font-light text-white">{weather.temp}°<span className="text-cyan-400 font-bold">c</span></p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-3xl">
          <p className="text-[8px] font-bold text-slate-600 mb-1 tracking-widest uppercase flex items-center gap-1.5">
            <Clock size={10} /> Local_Time
          </p>
          <p className="text-lg font-medium text-slate-200 tracking-tight">{isClient ? time : "00:00:00"}</p>
        </div>
      </div>

      {/* FITNESS LOGS */}
      <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black tracking-[0.25em] text-slate-500 flex items-center gap-2 uppercase">
            <Flame size={14} className="text-orange-500" /> Fitness_Logs
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-2xl active:scale-90 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            <Plus size={20} className="text-white" />
          </button>
        </div>

        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {gymLogs.length > 0 ? gymLogs.map((log, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-xs text-slate-400 font-mono italic">{">"} {log}</span>
              <button onClick={() => deleteLog(i)} className="text-slate-700 hover:text-red-400 p-1"><Trash2 size={14} /></button>
            </div>
          )) : (
            <p className="text-[10px] text-slate-700 text-center py-4 uppercase tracking-[0.3em]">No Data Synced</p>
          )}
        </div>
      </section>

      {/* MISSION STATUS - IMPROVED INTERACTIVITY */}
      <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-6 pb-4">
        <h2 className="text-[10px] font-black tracking-[0.25em] text-slate-500 mb-6 flex items-center gap-2 uppercase">
          <Target size={14} className="text-cyan-500" /> Mission_Status
        </h2>
        <div className="space-y-4">
          {missions.map((mission) => (
            <div key={mission.id} className="rounded-3xl bg-white/[0.01] border border-white/[0.04] transition-all">
              <button
                onClick={() => setOpenMission(openMission === mission.id ? null : mission.id)}
                className="w-full p-5 flex items-center justify-between active:bg-white/[0.03] rounded-3xl"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${openMission === mission.id ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-slate-800'}`} />
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{mission.title}</span>
                </div>
                {openMission === mission.id ? <ChevronUp size={16} className="text-slate-600" /> : <ChevronDown size={16} className="text-slate-600" />}
              </button>

              {openMission === mission.id && (
                <div className="px-5 pb-5 pt-0 space-y-3">
                  {mission.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleTask(mission.id, idx)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 active:bg-white/[0.05]"
                    >
                      {missionTasks[mission.id as keyof typeof missionTasks][idx] ?
                        <CheckCircle2 size={14} className="text-cyan-500" /> :
                        <Circle size={14} className="text-slate-700" />
                      }
                      <span className={`text-[10px] uppercase tracking-wide ${missionTasks[mission.id as keyof typeof missionTasks][idx] ? 'text-slate-600 line-through' : 'text-slate-400'}`}>
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-6 border-t border-white/5 flex justify-between items-center opacity-40">
        <div className="flex items-center gap-2 text-[8px] font-black text-cyan-500 tracking-widest uppercase">
          <Zap size={10} /> Secure_Connection_Stable
        </div>
        <Lock size={10} className="text-slate-700" />
      </footer>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[500] flex items-center justify-center p-8">
          <div className="bg-[#050505] border border-white/10 w-full rounded-[3rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">New_Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-600"><X size={24} /></button>
            </div>
            <input
              autoFocus
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-5 text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50 mb-8 font-mono text-sm"
              placeholder="System log entry..."
              value={newLog}
              onChange={(e) => setNewLog(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addLog()}
            />
            <button
              onClick={addLog}
              className="w-full bg-cyan-600 text-black font-black py-5 rounded-2xl active:scale-95 transition-all uppercase tracking-[0.2em] text-xs shadow-lg shadow-cyan-600/20"
            >
              Sync to database
            </button>
          </div>
        </div>
      )}
    </main>
  );
}