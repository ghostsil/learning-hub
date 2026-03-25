"use client";

import React, { useState, useEffect } from 'react';
import {
  Shield, Activity, Zap, Target, Lock, CloudSun,
  Plus, Flame, Clock, X, Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle, Calendar
} from 'lucide-react';

type LogEntry = {
  id: string;
  text: string;
  timestamp: string;
};

type MissionTasks = {
  [key: number]: boolean[];
};

export default function CommandCenter() {
  const [time, setTime] = useState("00:00:00");
  const [isClient, setIsClient] = useState(false);
  const [weather, setWeather] = useState({ temp: "--" });

  const [gymLogs, setGymLogs] = useState<LogEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLog, setNewLog] = useState("");
  const [openMission, setOpenMission] = useState<number | null>(null);
  const [missionTasks, setMissionTasks] = useState<MissionTasks>({
    1: [false, false, false],
    2: [false, false, false],
    3: [false, false, false]
  });

  useEffect(() => {
    setIsClient(true);
    const savedLogs = localStorage.getItem('ghostsil_logs_v2');
    const savedTasks = localStorage.getItem('ghostsil_tasks');
    if (savedLogs) setGymLogs(JSON.parse(savedLogs));
    if (savedTasks) setMissionTasks(JSON.parse(savedTasks));

    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);

    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current=temperature_2m');
        const data = await res.json();
        setWeather({ temp: Math.round(data.current.temperature_2m).toString() });
      } catch (err) { console.error(err); }
    };
    fetchWeather();
    return () => clearInterval(timer);
  }, []);

  const toggleTask = (missionId: number, taskIndex: number) => {
    const updatedTasks = { ...missionTasks };
    updatedTasks[missionId][taskIndex] = !updatedTasks[missionId][taskIndex];
    setMissionTasks(updatedTasks);
    localStorage.setItem('ghostsil_tasks', JSON.stringify(updatedTasks));
  };

  const calculateProgress = (missionId: number) => {
    const tasks = missionTasks[missionId];
    const completed = tasks.filter(t => t).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const addLog = () => {
    if (newLog.trim()) {
      const entry: LogEntry = {
        id: Date.now().toString(),
        text: newLog,
        timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
      };
      const updatedLogs = [entry, ...gymLogs];
      setGymLogs(updatedLogs);
      localStorage.setItem('ghostsil_logs_v2', JSON.stringify(updatedLogs));
      setNewLog("");
      setIsModalOpen(false);
    }
  };

  const deleteLog = (id: string) => {
    const updated = gymLogs.filter(log => log.id !== id);
    setGymLogs(updated);
    localStorage.setItem('ghostsil_logs_v2', JSON.stringify(updated));
  };

  const missions = [
    { id: 1, title: "Fitness: Weights & Calisthenics", tasks: ["5x5 Strength Set", "Handstand practice", "Post-workout recovery"] },
    { id: 2, title: "YouTube: Tech Automation", tasks: ["Research: Autonomous History", "Draft video script", "Edit opening sequence"] },
    { id: 3, title: "Logistics: Canton Fair 2026", tasks: ["Visa requirements", "Compare flight routes", "Draft sourcing list"] }
  ];

  return (
    <main className="min-h-screen bg-[#020202] text-slate-300 p-6 font-sans flex flex-col gap-6">
      {/* HEADER */}
      <header className="flex justify-between items-center pt-2">
        <div className="space-y-1">
          <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase leading-none">
            Command Center
          </h1>
          <p className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">ST-LGS // DATA_SYNC_READY</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-900/50 border border-white/5 backdrop-blur-md">
          <Activity size={18} className="text-cyan-400 animate-pulse" />
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-3xl">
          <p className="text-[8px] font-bold text-slate-600 mb-1 tracking-widest uppercase">Temp_Lagos</p>
          <p className="text-2xl font-light text-white">{weather.temp}°<span className="text-cyan-400 font-bold">C</span></p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-3xl">
          <p className="text-[8px] font-bold text-slate-600 mb-1 tracking-widest uppercase">System_Time</p>
          <p className="text-lg font-medium text-slate-200">{isClient ? time : "00:00:00"}</p>
        </div>
      </div>

      {/* FITNESS LOGS WITH TIMESTAMPS */}
      <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black tracking-[0.25em] text-slate-500 flex items-center gap-2 uppercase">
            <Calendar size={14} className="text-orange-500" /> Fitness_Archive
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-2xl active:scale-90"
          >
            <Plus size={20} className="text-white" />
          </button>
        </div>

        <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
          {gymLogs.length > 0 ? gymLogs.map((log) => (
            <div key={log.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] font-bold text-blue-500/50 uppercase tracking-tighter">{log.timestamp}</span>
                <button onClick={() => deleteLog(log.id)} className="text-slate-800 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
              </div>
              <p className="text-[12px] text-slate-300 font-mono leading-relaxed">{log.text}</p>
            </div>
          )) : (
            <p className="text-[10px] text-slate-700 text-center py-6 uppercase tracking-[0.3em]">No Logged Sessions</p>
          )}
        </div>
      </section>

      {/* MISSION STATUS */}
      <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-6 mb-8">
        <h2 className="text-[10px] font-black tracking-[0.25em] text-slate-500 mb-6 flex items-center gap-2 uppercase">
          <Target size={14} className="text-cyan-500" /> Objective_Tracking
        </h2>
        <div className="space-y-4">
          {missions.map((mission) => {
            const progress = calculateProgress(mission.id);
            return (
              <div key={mission.id} className="rounded-3xl bg-white/[0.01] border border-white/[0.04]">
                <button
                  onClick={() => setOpenMission(openMission === mission.id ? null : mission.id)}
                  className="w-full p-5 text-left active:bg-white/[0.03] rounded-3xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{mission.title}</span>
                    {openMission === mission.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 transition-all duration-700" style={{ width: `${progress}%` }} />
                  </div>
                </button>

                {openMission === mission.id && (
                  <div className="px-5 pb-5 pt-0 space-y-2">
                    {mission.tasks.map((task, idx) => (
                      <div key={idx} onClick={() => toggleTask(mission.id, idx)} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 active:bg-blue-500/10">
                        {missionTasks[mission.id][idx] ? <CheckCircle2 size={14} className="text-cyan-500" /> : <Circle size={14} className="text-slate-800" />}
                        <span className={`text-[10px] uppercase tracking-wide ${missionTasks[mission.id][idx] ? 'text-slate-600 line-through' : 'text-slate-400'}`}>{task}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[500] flex items-center justify-center p-8">
          <div className="bg-[#080808] border border-white/10 w-full rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            <h3 className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase mb-8 text-center">Commit_New_Log</h3>
            <input
              autoFocus
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-5 text-white mb-8 focus:border-blue-500/50 outline-none transition-all"
              placeholder="Session details..."
              value={newLog}
              onChange={(e) => setNewLog(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-900 text-slate-400 font-bold py-5 rounded-2xl uppercase text-[10px]">Abort</button>
              <button onClick={addLog} className="flex-[2] bg-blue-600 text-white font-black py-5 rounded-2xl active:scale-95 uppercase tracking-widest text-[10px]">Execute_Sync</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */ }
  <footer className="mt-auto py-6 flex justify-center items-center opacity-30 border-t border-white/5">
    <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 tracking-[0.4em] uppercase">
      <Shield size={10} /> Ghostsil_Protocol_v3.3
    </div>
  </footer>
    </main >
  );
}