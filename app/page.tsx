"use client";

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  ChevronRight,
  RefreshCw,
  Lock
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const VERSION = "V4.1";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// --- TYPES ---
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Mission {
  id: string;
  title: string;
  category: string;
  tasks: Task[];
  isEditing?: boolean;
}

export default function CommandCenter() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [newMissionTitle, setNewMissionTitle] = useState("");
  const [newMissionCategory, setNewMissionCategory] = useState("SYSTEM");
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. FETCH DATA
  const fetchMissions = async () => {
    if (!supabase) {
      setError("CONNECTION KEYS MISSING. CHECK VERCEL ENVIRONMENT VARIABLES.");
      return;
    }

    setIsSyncing(true);
    const { data, error: supabaseError } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false });

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setMissions(data || []);
      setError(null);
    }
    setIsSyncing(false);
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // 2. ADD MISSION (WITH FORM WRAPPER)
  const addMission = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload
    if (!newMissionTitle.trim() || !supabase) return;

    const newEntry = {
      title: newMissionTitle.toUpperCase(),
      category: newMissionCategory.toUpperCase(),
      tasks: []
    };

    const { data, error: postError } = await supabase
      .from('missions')
      .insert([newEntry])
      .select();

    if (!postError && data) {
      setMissions([data[0], ...missions]);
      setNewMissionTitle("");
    }
  };

  // 3. DELETE MISSION
  const deleteMission = async (id: string) => {
    if (!supabase) return;
    const { error: delError } = await supabase
      .from('missions')
      .delete()
      .eq('id', id);

    if (!delError) {
      setMissions(missions.filter(m => m.id !== id));
    }
  };

  // 4. TOGGLE TASK COMPLETION
  const toggleTask = async (missionId: string, taskId: string) => {
    if (!supabase) return;
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const updatedTasks = mission.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const { error: upError } = await supabase
      .from('missions')
      .update({ tasks: updatedTasks })
      .eq('id', missionId);

    if (!upError) {
      setMissions(missions.map(m =>
        m.id === missionId ? { ...m, tasks: updatedTasks } : m
      ));
    }
  };

  return (
    <main className="min-h-screen bg-black text-cyan-500 p-4 font-mono uppercase selection:bg-cyan-500 selection:text-black">

      {/* HEADER */}
      <header className="mb-8 border-b border-cyan-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-cyan-400">COMMAND CENTER</h1>
          <div className="text-[10px] opacity-50 flex gap-4">
            <span>ST-LGS // CLOUD_SYNC_{VERSION}</span>
          </div>
        </div>
        {isSyncing && <RefreshCw size={14} className="animate-spin" />}
      </header>

      {error && (
        <div className="mb-6 border border-red-900 bg-red-950/30 p-3 text-red-500 text-xs font-bold">
          ERROR: {error}
        </div>
      )}

      {/* MISSION CREATOR (FORM WRAPPER FOR RETURN KEY) */}
      <section className="mb-10 bg-cyan-950/10 border border-cyan-900/50 p-4">
        <form onSubmit={addMission} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-cyan-700">INPUT_NEW_MISSION</label>
            <input
              type="text"
              value={newMissionTitle}
              onChange={(e) => setNewMissionTitle(e.target.value)}
              placeholder="ENTER MISSION OBJECTIVE..."
              className="bg-black border-b border-cyan-800 p-2 text-cyan-300 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          <div className="flex justify-between items-center">
            <select
              value={newMissionCategory}
              onChange={(e) => setNewMissionCategory(e.target.value)}
              className="bg-black text-[10px] border border-cyan-900 p-1 outline-none"
            >
              <option value="SYSTEM">SYSTEM</option>
              <option value="CODING">CODING</option>
              <option value="GYM">GYM</option>
              <option value="HUMAN">HUMAN</option>
            </select>
            <button
              type="submit"
              className="flex items-center gap-2 bg-cyan-900/30 border border-cyan-500 px-4 py-2 text-xs font-bold hover:bg-cyan-500 hover:text-black transition-all"
            >
              <Plus size={14} /> INITIALIZE_MISSION
            </button>
          </div>
        </form>
      </section>

      {/* ACTIVE MISSIONS LIST */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-4 opacity-50">
          <Zap size={14} />
          <span className="text-xs font-bold tracking-[0.2em]">ACTIVE_MISSIONS</span>
        </div>

        {missions.map((mission) => (
          <div key={mission.id} className="group relative border-l-2 border-cyan-900 hover:border-cyan-400 bg-cyan-950/5 p-4 transition-all">

            {/* DELETE BUTTON (TOP RIGHT) */}
            <button
              onClick={() => deleteMission(mission.id)}
              className="absolute top-4 right-4 text-cyan-900 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>

            <div className="mb-2">
              <span className="text-[9px] text-cyan-600 font-bold tracking-widest">{mission.category}</span>
              <h3 className="text-lg font-bold text-cyan-100">{mission.title}</h3>
            </div>

            {/* TASK LIST */}
            <div className="space-y-2 mt-4 ml-2">
              {mission.tasks.length === 0 && (
                <p className="text-[10px] italic opacity-30">NO_SUB_TASKS_DEFINED</p>
              )}
              {mission.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(mission.id, task.id)}
                  className="flex items-center gap-3 cursor-pointer group/task"
                >
                  <div className={`w-3 h-3 border ${task.completed ? 'bg-cyan-500 border-cyan-500' : 'border-cyan-800'} transition-all`} />
                  <span className={`text-xs ${task.completed ? 'line-through opacity-30 text-cyan-700' : 'text-cyan-400'}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-6 h-1 w-full bg-cyan-950 overflow-hidden">
              <div
                className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-500"
                style={{
                  width: `${mission.tasks.length > 0
                    ? (mission.tasks.filter(t => t.completed).length / mission.tasks.length) * 100
                    : 0}%`
                }}
              />
            </div>
            <div className="mt-2 text-[8px] opacity-40 flex justify-between">
              <span>0% COMPLETE</span>
              <span>MISSION_ID: {mission.id.split('-')[0]}</span>
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER / SYNC STATUS */}
      <footer className="mt-20 py-8 border-t border-cyan-950 flex justify-between items-center opacity-40">
        <div className="flex items-center gap-2 text-[10px]">
          <Lock size={10} />
          <span>SYSTEM_LINKED // {new Date().toLocaleTimeString()}</span>
        </div>
        <button
          onClick={fetchMissions}
          className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px]"
        >
          <RefreshCw size={10} className={isSyncing ? "animate-spin" : ""} /> FORCE_SYNC
        </button>
      </footer>
    </main>
  );
}