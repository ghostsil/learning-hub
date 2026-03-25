"use client";

import { useState, useEffect } from "react";

export default function Home() {
  // 1. STATE MANAGEMENT
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean; category: string }[]>([]);
  const [history, setHistory] = useState<{ id: number; text: string; date: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("General");
  const [time, setTime] = useState("");
  const [quote, setQuote] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [weather, setWeather] = useState({ temp: "--", condition: "Loading...", city: "Lagos" });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Gallery Data
  const projects = [
    { title: "Antigravity Hub", status: "In Progress", tech: "Next.js", color: "text-purple-400" },
    { title: "Command Center", status: "Operational", tech: "Tailwind", color: "text-blue-400" },
    { title: "YouTube Automation", status: "Planning", tech: "Python", color: "text-green-400" }
  ];

  const categories = ["General", "Work", "Study", "Personal"];
  const quotes = [
    "The best way to get a project done is to start.",
    "Code is like humor. When you have to explain it, it’s bad.",
    "First, solve the problem. Then, write the code.",
    "Success is a series of small wins."
  ];

  // 2. SOUND ENGINE
  const playSound = (type: "success" | "delete") => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.setValueAtTime(type === "success" ? 880 : 220, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) { }
  };

  // 3. EFFECTS
  useEffect(() => {
    const savedTasks = localStorage.getItem("cc-tasks");
    const savedHistory = localStorage.getItem("cc-history");
    const savedTheme = localStorage.getItem("cc-theme");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedTheme) setIsDarkMode(savedTheme === "dark");
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setTimeout(() => setWeather({ temp: "31°C", condition: "Sunny", city: "Lagos" }), 1500);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cc-tasks", JSON.stringify(tasks));
      localStorage.setItem("cc-history", JSON.stringify(history));
      localStorage.setItem("cc-theme", isDarkMode ? "dark" : "light");
    }
  }, [tasks, history, isDarkMode, isLoaded]);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false); playSound("success"); clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // 4. FUNCTIONS
  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, category: category }]);
    setNewTask("");
  };

  const archiveTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      playSound("success");
      setHistory([{ id: Date.now(), text: task.text, date: new Date().toLocaleDateString() }, ...history]);
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const theme = {
    bg: isDarkMode ? "bg-slate-900" : "bg-slate-50",
    card: isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900",
    text: isDarkMode ? "text-white" : "text-slate-900",
    subtext: isDarkMode ? "text-slate-400" : "text-slate-500",
    input: isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-100 border-slate-300 text-slate-900"
  };

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} p-4 md:p-6 lg:p-8 font-sans transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto">

        {/* HEADER: Adjusted for Mobile */}
        <header className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-700/50 pb-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black text-blue-500 tracking-tighter italic">COMMAND CENTER v2.1</h1>
            <p className={theme.subtext + " text-xs uppercase tracking-widest"}>Lagos Sector // Operational</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-4 py-2 rounded-full border text-xs font-bold transition-all active:scale-95 ${theme.card}`}
            >
              {isDarkMode ? "DARK MODE" : "LIGHT MODE"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: MISSION CONTROL (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* TASK INPUT */}
            <div className={`p-6 rounded-3xl border shadow-2xl ${theme.card}`}>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-blue-500">Add Mission Objective</h2>
              <form onSubmit={(e) => { e.preventDefault(); addTask(); }} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Describe objective..."
                    className={`flex-1 px-4 py-4 rounded-2xl text-base focus:ring-2 focus:ring-blue-500 outline-none border ${theme.input}`}
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 rounded-2xl font-black text-white active:scale-90 transition-transform">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat} type="button" onClick={() => setCategory(cat)}
                      className={`text-[10px] px-4 py-2 rounded-full border font-bold transition-all ${category === cat ? 'bg-blue-600 border-blue-600 text-white' : theme.subtext + ' border-slate-700'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* PROJECT GALLERY: NEW SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((p, i) => (
                <div key={i} className={`p-4 rounded-2xl border shadow-lg ${theme.card}`}>
                  <h3 className="text-xs font-black uppercase opacity-50 mb-1">{p.tech}</h3>
                  <p className="font-bold mb-2">{p.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-slate-900/50 border border-slate-700 ${p.color}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>

            {/* TASK LIST */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className={`flex items-center justify-between p-4 rounded-2xl border ${theme.card} group`}>
                  <div className="flex items-center gap-4">
                    <button onClick={() => archiveTask(task.id)} className="w-8 h-8 rounded-xl border-2 border-blue-500 flex items-center justify-center hover:bg-blue-500 transition-colors text-transparent hover:text-white">✓</button>
                    <div>
                      <p className="font-bold text-sm md:text-base">{task.text}</p>
                      <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">{task.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: DATA PANELS (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* TIMER: Larger Buttons for Mobile */}
            <div className={`p-8 rounded-3xl border shadow-xl text-center ${theme.card}`}>
              <h3 className="text-[10px] uppercase font-black tracking-[0.2em] mb-4 opacity-50">Deep Focus Timer</h3>
              <div className="text-6xl font-black font-mono mb-8 text-blue-500 tracking-tighter">{formatTimer(timeLeft)}</div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIsActive(!isActive)} className={`py-4 rounded-2xl font-black text-white uppercase text-xs tracking-widest ${isActive ? 'bg-amber-500' : 'bg-green-600'}`}>
                  {isActive ? "Pause" : "Initiate"}
                </button>
                <button onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }} className="bg-slate-700 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-white">Reset</button>
              </div>
            </div>

            {/* LOG: Scrollable */}
            <div className={`p-6 rounded-3xl border shadow-xl h-64 flex flex-col ${theme.card}`}>
              <h3 className="text-[10px] uppercase font-black tracking-widest mb-4 opacity-50">Mission Log</h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {history.map(item => (
                  <div key={item.id} className="text-xs border-l-2 border-blue-500 pl-3 py-1">
                    <p className="font-bold">{item.text}</p>
                    <p className="opacity-40 text-[9px] uppercase mt-1">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER STATS */}
            <div className={`p-4 rounded-2xl border flex justify-between font-mono text-[10px] uppercase font-bold ${theme.card}`}>
              <span className="text-blue-500">SEC: {weather.city} // {weather.temp}</span>
              <span>{time}</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}