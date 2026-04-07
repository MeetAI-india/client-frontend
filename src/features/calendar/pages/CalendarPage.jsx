import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';

export default function CalendarPage() {
    const events = [
        { time: "09:00", title: "Core Architecture Review", category: "Meeting" },
        { time: "13:30", title: "Project Phoenix Launch", category: "Internal" },
        { time: "16:45", title: "AI Ethics Symposium", category: "Global" },
    ];

    return (
        <div className="space-y-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-white/5 rounded-3xl border border-white/10"><CalendarIcon size={32} className="text-foreground" /></div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic leading-none mb-2">Chronos<br />Timeline</h1>
                        <p className="text-sm text-muted-foreground font-medium tracking-wide">Syncing 24 units of operational flow.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white/5 rounded-2xl border border-white/10 p-1">
                        <button className="p-3 hover:bg-white/5 rounded-xl text-muted-foreground transition-all"><ChevronLeft size={20} /></button>
                        <button className="p-3 hover:bg-white/5 rounded-xl text-muted-foreground transition-all"><ChevronRight size={20} /></button>
                    </div>
                    <button className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"><Plus size={24} /></button>
                </div>
            </header>

            {/* --- TIMELINE GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* CALENDAR VIEW PLACEHOLDER */}
                <div className="lg:col-span-3 bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 min-h-[600px] flex items-center justify-center relative overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
                    <p className="relative z-10 text-[10px] uppercase tracking-[0.6em] font-black italic text-muted-foreground opacity-40">Operational Grid Initializing...</p>
                </div>

                {/* UPCOMING SIDEBAR */}
                <div className="space-y-8">
                    <h3 className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.5em]">Upcoming Flow</h3>
                    <div className="space-y-4">
                        {events.map((e) => (
                            <div key={e.title} className="group p-6 bg-white/5 border border-white/5 rounded-[32px] hover:border-white/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock size={14} className="text-muted-foreground" />
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{e.time}</span>
                                </div>
                                <h4 className="text-sm font-black text-foreground tracking-tight mb-4 group-hover:translate-x-1 transition-transform">{e.title}</h4>
                                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full inline-block text-[8px] font-black uppercase text-muted-foreground tracking-[0.2em]">{e.category}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
