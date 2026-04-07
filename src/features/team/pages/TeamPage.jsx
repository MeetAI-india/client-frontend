import React from 'react';
import { Users, MoreHorizontal, Shield, Mail, Zap } from 'lucide-react';
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function TeamPage() {
    const members = [
        { name: "Aria Sterling", role: "Neuro-Architect", status: "Active", avatar: "AS" },
        { name: "Marcus Thorne", role: "Core Developer", status: "Active", avatar: "MT" },
        { name: "Elena Vane", role: "UI Strategist", status: "Idle", avatar: "EV" },
    ];

    return (
        <div className="space-y-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic leading-none mb-3">Operational<br />Team</h1>
                    <p className="text-sm text-muted-foreground font-medium tracking-wide">Syncing the collective intelligence of MeetAI.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-foreground hover:bg-white/10 transition-all"><Users size={20} /></button>
                    <Button onClick={() => { }}>Enroll Unit</Button>
                </div>
            </header>

            {/* --- TEAM GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {members.map((m) => (
                    <Card key={m.name} className="p-10 rounded-[48px] shadow-2xl overflow-hidden">
                        {/* Reflections */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-30" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-[32px] bg-white flex items-center justify-center text-black font-black text-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] mb-8 group-hover:scale-110 transition-transform duration-700">
                                {m.avatar}
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-1 tracking-tight">{m.name}</h3>
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em] mb-8">{m.role}</p>

                            <div className="flex items-center gap-6 mb-10">
                                <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"><Mail size={18} /></button>
                                <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"><Shield size={18} /></button>
                                <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"><MoreHorizontal size={18} /></button>
                            </div>

                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-2 border border-white/5">
                                <div className={`h-full w-2/3 bg-foreground rounded-full group-hover:shadow-[0_0_20px_white] transition-all duration-1000`} />
                            </div>
                            <p className="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Efficiency Index: 88%</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* --- QUICK INVITE --- */}
            <Card className="p-10 bg-white/5 border-white/10 rounded-[48px] flex items-center justify-between group backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-white/5 rounded-3xl"><Zap size={24} className="text-foreground" /></div>
                    <div>
                        <h4 className="text-lg font-black text-foreground tracking-tight">Need more capacity?</h4>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Scale your infrastructure instantly</p>
                    </div>
                </div>
                <Button variant="secondary" className="px-6 py-3 rounded-2xl group-hover:bg-white group-hover:text-black">
                    Expand Operations
                </Button>
            </Card>
        </div>
    );
}
