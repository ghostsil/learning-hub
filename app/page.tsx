"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Zap, Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2,
  Circle, ListPlus, LayoutGrid, Search, Sun, Moon, AlertTriangle, Lock
} from 'lucide-react';

// Safety Check for Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client only if keys exist to prevent build crash
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

type Task = { id: string; text: string; completed: boolean; priority: boolean; };
type Mission = { id: string; title: string; category: string; tasks: Task[]; };

export default function CommandCenter() {
  const [time, setTime] = useState("00:00:00");
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  const [missions, setMissions] = useState<Mission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [newInput, setNewInput] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [openMission, setOpenMission] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (supabase) fetchMissions();
    const savedTheme = localStorage.getItem('gs_theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function fetchMissions() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('missions').select('*');
    if (!error && data) setMissions(data);
    setLoading(false);
  }

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('gs_theme', newMode ? 'dark' : 'light');
  };

  const createMission = async () => {
    if (newInput.trim() && newCategory.trim() && supabase) {
      const { data, error } = await supabase.from('missions').insert([
        { title: newInput, category: newCategory.toUpperCase(), tasks: [] }
      ]).select();
      if (!error && data) setMissions([...missions, data[0]]);
      setNewInput(""); setNewCategory(""); setIsMissionModalOpen(false);
    }
  };

  const deleteMission = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase.from('missions').delete().eq('id', id);
    if (!error) setMissions(missions.filter(m => m.id !== id));
  };

  const addTask = async () => {
    if (newInput.trim() && activeMissionId && supabase) {
      const mission = missions.find(m => m.id === activeMissionId);
      if (!mission) return;
      const newTask: Task = { id: Date.now().toString(), text: newInput, completed: false, priority: isPriority };
      const updatedTasks = [newTask, ...mission.tasks];

      const { error } = await supabase.from('missions').update({ tasks: updatedTasks }).eq('id', activeMissionId);
      if (!error) {
        setMissions(missions.map(m => m.id === activeMissionId ? { ...m, tasks: updatedTasks } : m));
      }
      setNewInput(""); setIsPriority(false); setIsTaskModalOpen(false);
    }
  };

  const toggleTask = async (mId: string, tId: string) => {
    if (!supabase) return;
    const mission = missions.find(m => m.id === mId);
    if (!mission) return;
    const updatedTasks = mission.tasks.map(t => t.id === tId ? { ...t, completed: !t.completed } : t);
    const { error } = await supabase.from('missions').update({ tasks: updatedTasks }).eq('id', mId);
    if (!error) setMissions(missions.map(m => m.id === mId ? { ...m, tasks: updatedTasks } : m));
  };

  const deleteTask = async (mId: string, tId: string) => {
    if (!supabase) return;
    const mission = missions.find(m => m.id === mId);
    if (!mission) return;
    const updatedTasks = mission.tasks.filter(t => t.id !== tId);
    const { error } = await supabase.from('missions').update({ tasks: updatedTasks }).eq('id', mId);
    if (!error) setMissions(missions.map(m => m.id === mId ? { ...m, tasks: updatedTasks } : m));
  };

  const filteredMissions = missions.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isClient) return null;

  return (
    <main className={`min-h-screen p-6 font-sans flex flex-col gap-6 transition-colors duration-500 ${darkMode ? 'bg-[#020202] text-slate-300' : 'bg-slate-50 text-slate-900'}`}>
      <header className="flex justify-between items-center pt-2">
        <div className="space-y-1">
          <h1 className={`text-xl font-black tracking-tighter uppercase leading-none ${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500' : 'text-blue-600'}`}>Command Center</h1>
          <p className={`text-[9px] font-bold tracking-[0.2em] uppercase ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>ST-LGS // CLOUD_SYNC_v3.9.1</p>
        </div>
        <button onClick={toggleTheme} className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-slate-900 text-yellow-400' : 'bg-white shadow-md text-blue-600'}`}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {!supabase && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl text-[10px] text-red-500 font-bold uppercase tracking-widest">
          Error: Connection keys missing. Check Vercel Environment Variables.
        </div>
      )}

      <div className="relative">
        <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input type="text" placeholder="FILTER_SYSTEM..." className={`w-full rounded-2xl py-4 pl-12 pr-6 text-[10px] font-bold tracking-widest outline-none transition-all uppercase ${darkMode ? 'bg-[#0A0A0A] border border-white/5 text-slate-200' : 'bg-white border border-slate-200 shadow-sm'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <section className={`rounded-[2.5rem] p-6 border transition-all flex-1 ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[10px] font-black tracking-[0.25em] text-slate-500 flex items-center gap-2 uppercase">
            <LayoutGrid size={14} /> {loading ? 'SYNCING...' : 'Active_Missions'}
          </h2>
          <button onClick={() => { setNewInput(""); setIsMissionModalOpen(true); }} className={`w-10 h-10 flex items-center justify-center rounded-2xl active:scale-90 border transition-all ${darkMode ? 'bg-cyan-600/20 text-cyan-400 border-cyan-500/20' : 'bg-blue-600 text-white shadow-lg'}`}>
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {filteredMissions.map((m) => {
            const completed = m.tasks?.filter(t => t.completed).length || 0;
            const progress = m.tasks?.length > 0 ? Math.round((completed / m.tasks.length) * 100) : 0;
            const sortedTasks = [...(m.tasks || [])].sort((a, b) => (a.priority === b.priority ? 0 : a.priority ? -1 : 1));

            return (
              <div key={m.id} className={`rounded-3xl border overflow-hidden transition-all ${darkMode ? 'bg-white/[0.01] border-white/[0.04]' : 'bg-slate-50 border-slate-100'}`}>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className={`text-[8px] font-black tracking-widest uppercase ${darkMode ? 'text-blue-500' : 'text-blue-600'}`}>{m.category}</span>
                      <h3 className={`text-[11px] font-bold uppercase ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{m.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setActiveMissionId(m.id); setIsTaskModalOpen(true); }} className={`p-2 rounded-xl ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}><ListPlus size={14} /></button>
                      <button onClick={() => deleteMission(m.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <button onClick={() => setOpenMission(openMission === m.id ? null : m.id)} className="w-full">
                    <div className={`w-full h-1 rounded-full overflow-hidden mb-2 ${darkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
                      <div className={`h-full transition-all duration-700 ${darkMode ? 'bg-cyan-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-[8px] font-bold uppercase text-slate-500">
                      <span>{progress}% Complete</span>
                      {openMission === m.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </div>
                  </button>
                </div>
                {openMission === m.id && (
                  <div className={`px-5 pb-5 space-y-2 pt-4 border-t ${darkMode ? 'border-white/[0.02]' : 'border-slate-200'}`}>
                    {sortedTasks.map((t) => (
                      <div key={t.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${t.priority && !t.completed ? (darkMode ? 'border-red-500/30 bg-red-500/5' : 'border-red-200 bg-red-50') : (darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200')}`}>
                        <div className="flex items-center gap-3 flex-1" onClick={() => toggleTask(m.id, t.id)}>
                          {t.completed ? <CheckCircle2 size={14} className="text-green-500" /> : (t.priority ? <AlertTriangle size={14} className="text-red-500 animate-pulse" /> : <Circle size={14} className="text-slate-400" />)}
                          <span className={`text-[10px] uppercase font-bold ${t.completed ? 'text-slate-500 line-through' : (t.priority ? 'text-red-500' : '')}`}>{t.text}</span>
                        </div>
                        <button onClick={() => deleteTask(m.id, t.id)} className="text-slate-400 p-1 hover:text-red-500"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* MODALS */}
      {(isTaskModalOpen || isMissionModalOpen) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[600] flex items-center justify-center p-8">
          <div className={`w-full rounded-[2.5rem] p-8 border ${darkMode ? 'bg-[#080808] border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-[10px] font-black tracking-widest uppercase mb-6 text-center ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{isTaskModalOpen ? 'Assign_Objective' : 'Init_Mission'}</h3>
            <input autoFocus className={`w-full rounded-2xl p-5 mb-4 outline-none border ${darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder={isTaskModalOpen ? "Task Detail..." : "Mission Name..."} value={newInput} onChange={(e) => setNewInput(e.target.value)} />
            {isMissionModalOpen && <input className={`w-full rounded-2xl p-5 mb-6 outline-none border ${darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} placeholder="Category..." value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />}
            {isTaskModalOpen && (
              <div className="flex items-center gap-3 mb-6 px-2">
                <button onClick={() => setIsPriority(!isPriority)} className={`w-10 h-6 rounded-full transition-all relative ${isPriority ? 'bg-red-600' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPriority ? 'left-5' : 'left-1'}`} />
                </button>
                <span className={`text-[9px] font-black uppercase ${isPriority ? 'text-red-500' : 'text-slate-500'}`}>High_Priority_Alert</span>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setIsTaskModalOpen(false); setIsMissionModalOpen(false); setIsPriority(false); }} className={`flex-1 font-bold py-4 rounded-2xl uppercase text-[10px] ${darkMode ? 'bg-slate-900 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>Abort</button>
              <button onClick={isTaskModalOpen ? addTask : createMission} className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl uppercase text-[10px]">Execute</button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto py-6 flex justify-between items-center opacity-30 border-t border-slate-200/10 text-[8px] font-black uppercase tracking-[0.4em]">
        <div><Zap size={10} className="inline mr-2" /> System_Linked // {time}</div>
        <Lock size={10} />
      </footer>
    </main>
  );
}