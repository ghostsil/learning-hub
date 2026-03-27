"use client";

import React, { useState, useEffect } from 'react';
import {
  Zap, Plus, Trash2, Check, X,
  RefreshCw, Lock, CloudSun, Calendar
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const VERSION = "V4.2.1";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

interface Task { id: string; text: string; completed: boolean; }
interface Mission { id: string; title: string; category: string; tasks: Task[]; }

export default function CommandCenter() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [newMissionTitle, setNewMissionTitle] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [weather, setWeather] = useState("LOCATING...");

  // 1. DATA FETCHING
  const fetchMissions = async () => {
    if (!supabase) return;
    setIsSyncing(true);
    const { data } = await supabase.from('missions').select('*').order('created_at', { ascending: false });
    if (data) setMissions(data);
    setIsSyncing(false);
  };

  useEffect(() => {
    fetchMissions();
    // Simulate Weather for Lagos
    const mockWeather = ["31°C SUNNY", "29°C HUMID", "33°C CLEAR", "30°C PARTLY CLOUDY"];
    setWeather(mockWeather[Math.floor(Math.random() * mockWeather.length)]);
  }, []);

  // 2. MISSION ACTIONS
  const addMission = async (e: React.FormEvent) => {
    e.preventDefault(); // This enables the 'Return' key to work without reload
    if (!newMissionTitle.trim() || !supabase) return;
    const { data } = await supabase.from('missions').insert([{
      title: newMissionTitle.toUpperCase(),
      category: "GENERAL",
      tasks: []
    }]).select();
    if (data) {
      setMissions([data[0], ...missions]);
      setNewMissionTitle("");
    }
  };

  const updateMissionTitle = async (id: string) => {
    if (!editTitle.trim() || !supabase) return;
    const { error } = await supabase.from('missions').update({ title: editTitle.toUpperCase() }).eq('id', id);
    if (!error) {
      setMissions(missions.map(m => m.id === id ? { ...m, title: editTitle.toUpperCase() } : m));
      setExpandedId(null);
    }
  };

  const deleteMission = async (id: string) => {
    if (!supabase || !confirm("CONFIRM_DELETION?")) return;
    const { error } = await supabase.from('missions').delete().eq('id', id);
    if (!error) setMissions(missions.filter(m => m.id !== id));
  };

  // 3. TASK ACTIONS
  const addTask = async (e: React.FormEvent, missionId: string) => {
    e.preventDefault(); // Return key for sub-tasks
    if (!newTaskText.trim() || !supabase) return;
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const newTask = { id: Date.now().toString(), text: newTaskText.toUpperCase(), completed: false };
    const updatedTasks = [...(mission.tasks || []), newTask];

    const { error } = await supabase.from('missions').update({ tasks: updatedTasks }).eq('id', missionId);
    if (!error) {
      setMissions(missions.map(m => m.id === missionId ? { ...m, tasks: updatedTasks } : m));
      setNewTaskText("");
    }
  };

  const toggleTask = async (missionId: string, taskId: string) => {
    if (!supabase) return;
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;
    const updatedTasks = mission.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    await supabase.from('missions').update({ tasks: updatedTasks }).eq('id', missionId);
    setMissions(missions.map(m => m.id === missionId ? { ...m, tasks: updatedTasks } : m));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-cyan-500 p-6 font-mono selection:bg-cyan-500 selection:text-black uppercase">

      {/* HEADER */}
      <header className="mb-10 flex justify-between items-start border-b border-cyan-900/30 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white">COMMAND CENTER</h1>
          <div className="flex gap-4 mt-1 text-[10px] font-bold opacity-60 italic">
            <span className="flex items-center gap-1 text-yellow-500"><CloudSun size={12} /> {weather}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date().toLocaleDateString()}</span>
            <span>{VERSION}</span>
          </div>
        </div>
        <RefreshCw
          size={18}
          className={isSyncing ? "animate-spin text-cyan-400" : "opacity-20 cursor-pointer hover:opacity-100"}
          onClick={fetchMissions}
        />
      </header>

      {/* NEW MISSION FORM */}
      <form onSubmit={addMission} className="mb-12 relative group">
        <input
          type="text"
          value={newMissionTitle}
          onChange={(e) => setNewMissionTitle(e.target.value)}
          placeholder="INITIALIZE NEW OBJECTIVE..."
          className="w-full bg-transparent border-b-2 border-cyan-900 p-4 text-sm focus:outline-none focus:border-cyan-400 transition-all placeholder:opacity-20"
        />
        <button type="submit" className="absolute right-4 top-4 opacity-40 group-focus-within:opacity-100">
          <Plus size={20} />
        </button>
      </form>

      {/* MISSION LIST */}
      <div className="grid gap-4">
        {missions.map((m) => (
          <div
            key={m.id}
            className={`border transition-all duration-300 ${expandedId === m.id ? 'border-cyan-400 bg-cyan-950/10' : 'border-cyan-900/40 bg-black/40'}`}
          >
            {/* CLICKABLE HEADER */}
            <div
              onClick={() => {
                if (expandedId === m.id) setExpandedId(null);
                else { setExpandedId(m.id); setEditTitle(m.title); }
              }}
              className="p-5 cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="text-[9px] opacity-40 tracking-widest">MISSION_FILE</p>
                <h2 className="text-sm font-bold text-cyan-100">{m.title}</h2>
              </div>
              <div className="text-[9px] font-bold opacity-30 border border-cyan-900 px-2 py-1">
                DATA_SYNCED
              </div>
            </div>

            {/* EXPANDED INTERFACE */}
            {expandedId === m.id && (
              <div className="p-5 pt-0 border-t border-cyan-900/30 animate-in fade-in slide-in-from-top-1">

                {/* RENAME / DELETE CONTROL */}
                <div className="mt-4 mb-6 flex gap-2">
                  <input
                    autoFocus
                    className="flex-1 bg-cyan-900/20 border border-cyan-800 p-2 text-xs text-white outline-none"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button onClick={() => updateMissionTitle(m.id)} className="bg-cyan-600 text-black p-2 hover:bg-cyan-400"><Check size={16} /></button>
                  <button onClick={() => deleteMission(m.id)} className="bg-red-900/20 text-red-500 p-2 hover:bg-red-500 hover:text-white"><Trash2 size={16} /></button>
                </div>

                {/* TASK LIST */}
                <div className="space-y-3 mb-6">
                  {m.tasks?.map(t => (
                    <div key={t.id} onClick={() => toggleTask(m.id, t.id)} className="flex items-center gap-3 text-xs cursor-pointer group">
                      <div className={`w-4 h-4 border flex items-center justify-center ${t.completed ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-cyan-800 group-hover:border-cyan-400'}`}>
                        {t.completed && <Check size={12} />}
                      </div>
                      <span className={t.completed ? 'line-through opacity-30' : 'text-cyan-300'}>{t.text}</span>
                    </div>
                  ))}
                </div>

                {/* ADD TASK FORM */}
                <form onSubmit={(e) => addTask(e, m.id)} className="flex border-t border-cyan-900/30 pt-4 gap-2">
                  <input
                    placeholder="ADD SUB-TASK..."
                    className="flex-1 bg-transparent text-[10px] focus:outline-none"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                  />
                  <button type="submit" className="text-cyan-400 opacity-50 hover:opacity-100">
                    <Plus size={14} />
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      <footer className="mt-20 py-10 opacity-20 text-[8px] flex justify-between border-t border-cyan-900/20 tracking-[0.5em]">
        <div className="flex items-center gap-2"><Lock size={10} /> ENCRYPTION_STABLE</div>
        <span>ANTIGRAVITY_STATION</span>
      </footer>
    </main>
  );
}