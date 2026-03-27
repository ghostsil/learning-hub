"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Zap, Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2,
  Circle, ListPlus, LayoutGrid, Search, Sun, Moon, AlertTriangle,
  Lock, Edit3, Save, Dumbbell, CornerDownLeft
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function CommandCenter() {
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal & Edit States
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeMissionId, setActiveMissionId] = useState(null);

  // Input States
  const [newInput, setNewInput] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  const [openMission, setOpenMission] = useState(null);

  useEffect(() => {
    setIsClient(true);
    if (supabase) fetchMissions();
    const savedTheme = localStorage.getItem('gs_theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
  }, []);

  async function fetchMissions() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('missions').select('*').order('created_at', { ascending: false });
    if (!error && data) setMissions(data);
    setLoading(false);
  }

  // --- DATABASE ACTIONS ---

  const saveMission = async () => {
    if (!newInput.trim() || !supabase) return;

    if (editingId) {
      // Update existing
      const { error } = await supabase.from('missions').update({ title: newInput, category: newCategory.toUpperCase() }).eq('id', editingId);
      if (!error) {
        setMissions(missions.map(m => m.id === editingId ? { ...m, title: newInput, category: newCategory.toUpperCase() } : m));
      }
    } else {
      // Create new
      const { data, error } = await supabase.from('missions').insert([
        { title: newInput, category: newCategory.toUpperCase() || 'GENERAL', tasks: [] }
      ]).select();
      if (!error && data) setMissions([data[0], ...missions]);
    }
    closeModals();
  };

  const saveTask = async () => {
    if (!newInput.trim() || !activeMissionId || !supabase) return;
    const mission = missions.find(m => m.id === activeMissionId);
    if (!mission) return;

    let updatedTasks;
    if (editingId) {
      updatedTasks = mission.tasks.map(t => t.id === editingId ? { ...t, text: newInput, priority: isPriority } : t);
    } else {
      const newTask = { id: Date.now().toString(), text: newInput, completed: false, priority: isPriority };
      updatedTasks = [newTask, ...mission.tasks];
    }

    const { error } = await supabase.from('missions').update({ tasks: updatedTasks }).eq('id', activeMissionId);
    if (!error) {
      setMissions(missions.map(m => m.id === activeMissionId ? { ...m, tasks: updatedTasks } : m));
    }
    closeModals();
  };

  const deleteMission = async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from('missions').delete().eq('id', id);
    if (!error) setMissions(missions.filter(m => m.id !== id));
  };

  const toggleTask = async (mId, tId) => {
    const mission = missions.find(m => m.id === mId);
    const updatedTasks = mission.tasks.map(t => t.id === tId ? { ...t, completed: !t.completed } : t);
    const { error } = await supabase.from('missions').update({ tasks: updatedTasks }).eq('id', mId);
    if (!error) setMissions(missions.map(m => m.id === mId ? { ...m, tasks: updatedTasks } : m));
  };

  // --- HELPERS ---

  const closeModals = () => {
    setIsMissionModalOpen(false);
    setIsTaskModalOpen(false);
    setEditingId(null);
    setNewInput("");
    setNewCategory("");
    setIsPriority(false);
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      action();
    }
    // Standard "Enter" will now just create a new line in the textarea automatically
  };

  if (!isClient) return null;

  return (
    <main className={`min-h-screen p-4 md:p-8 font-sans flex flex-col gap-6 transition-all ${darkMode ? 'bg-[#020202] text-slate-300' : 'bg-slate-50 text-slate-900'}`}>

      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg animate-pulse"><Zap size={18} className="text-white" /></div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Command Center</h1>
            <p className="text-[8px] font-bold tracking-[0.3em] text-blue-500 uppercase">Production_v4.0_LGS</p>
          </div>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-2xl ${darkMode ? 'bg-slate-900 text-yellow-400' : 'bg-white shadow-md text-blue-600'}`}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* SEARCH */}
      <div className="relative">
        <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="SEARCH_LOGS..."
          className={`w-full rounded-2xl py-4 pl-12 pr-6 text-[10px] font-bold tracking-widest outline-none transition-all uppercase ${darkMode ? 'bg-[#0A0A0A] border border-white/5 text-slate-200' : 'bg-white border border-slate-200 shadow-sm'}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* MISSIONS GRID */}
      <section className={`rounded-[2.5rem] p-6 border flex-1 ${darkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase flex items-center gap-2">
            <LayoutGrid size={14} /> {loading ? 'Syncing...' : 'Active_Missions'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => { setNewCategory("GYM"); setIsMissionModalOpen(true); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-bold border transition-all ${darkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600 border-orange-100'}`}
            >
              <Dumbbell size={14} /> + SESSION
            </button>
            <button
              onClick={() => setIsMissionModalOpen(true)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg active:scale-90 transition-all`}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {missions.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())).map((m) => {
            const progress = m.tasks?.length ? Math.round((m.tasks.filter(t => t.completed).length / m.tasks.length) * 100) : 0;
            return (
              <div key={m.id} className={`rounded-3xl border transition-all ${darkMode ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div onClick={() => setOpenMission(openMission === m.id ? null : m.id)} className="cursor-pointer space-y-1 flex-1">
                      <span className={`text-[8px] font-black tracking-widest uppercase ${m.category === 'GYM' ? 'text-orange-500' : 'text-blue-500'}`}>{m.category}</span>
                      <h3 className="text-[11px] font-bold uppercase">{m.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(m.id); setNewInput(m.title); setNewCategory(m.category); setIsMissionModalOpen(true); }} className="p-2 text-slate-500 hover:text-blue-500"><Edit3 size={14} /></button>
                      <button onClick={() => { setActiveMissionId(m.id); setIsTaskModalOpen(true); }} className="p-2 bg-blue-600/10 text-blue-500 rounded-lg"><ListPlus size={14} /></button>
                      <button onClick={() => deleteMission(m.id)} className="p-2 text-slate-500 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${m.category === 'GYM' ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[8px] font-black text-slate-500">{progress}%</span>
                  </div>
                </div>

                {openMission === m.id && (
                  <div className="px-5 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-300">
                    {m.tasks.map((t) => (
                      <div key={t.id} className={`group flex items-center justify-between p-3 rounded-xl border ${darkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleTask(m.id, t.id)}>
                          {t.completed ? <CheckCircle2 size={14} className="text-green-500" /> : (t.priority ? <AlertTriangle size={14} className="text-red-500 animate-pulse" /> : <Circle size={14} className="text-slate-500" />)}
                          <span className={`text-[10px] font-bold uppercase whitespace-pre-wrap ${t.completed ? 'opacity-30 line-through' : ''}`}>{t.text}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingId(t.id); setActiveMissionId(m.id); setNewInput(t.text); setIsPriority(t.priority); setIsTaskModalOpen(true); }} className="p-1 text-slate-500"><Edit3 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* MODAL SYSTEM */}
      {(isMissionModalOpen || isTaskModalOpen) && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-[2.5rem] p-8 border ${darkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black tracking-widest uppercase text-blue-500">
                {editingId ? 'Modify_Record' : (isMissionModalOpen ? 'Initialize_Mission' : 'Assign_Task')}
              </h3>
              <div className="text-[8px] text-slate-500 font-bold flex items-center gap-1">
                <CornerDownLeft size={10} /> SHIFT+ENTER TO SAVE
              </div>
            </div>

            <textarea
              autoFocus
              className={`w-full rounded-2xl p-5 mb-4 outline-none border text-[12px] font-bold min-h-[100px] ${darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`}
              placeholder="Input protocols..."
              value={newInput}
              onChange={(e) => setNewInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, isMissionModalOpen ? saveMission : saveTask)}
            />

            {isMissionModalOpen && (
              <input
                className={`w-full rounded-xl p-4 mb-6 outline-none border text-[10px] font-bold uppercase ${darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`}
                placeholder="Category (e.g. WORK, GYM, DEV)..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            )}

            <div className="flex gap-3">
              <button onClick={closeModals} className="flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase bg-slate-800 text-slate-400">Abort</button>
              <button onClick={isMissionModalOpen ? saveMission : saveTask} className="flex-[2] py-4 rounded-2xl text-[10px] font-black uppercase bg-blue-600 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                <Save size={14} /> {editingId ? 'Update' : 'Execute'}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="opacity-20 text-[8px] font-black tracking-[0.5em] uppercase flex justify-between items-center pt-4 border-t border-white/5">
        <span>System_Encrypted</span>
        <Lock size={10} />
      </footer>
    </main>
  );
}