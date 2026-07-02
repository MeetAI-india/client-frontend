import React from 'react';
import { FileText, Download, TrendingUp, BarChart3, Zap } from 'lucide-react';

export default function ReportsPage() {
    const reportCards = [
        { title: "Monthly Insights", date: "Oct 2023", size: "2.4 MB", type: "PDF" },
        { title: "AI Summary Export", date: "Sep 2023", size: "1.1 MB", type: "JSON" },
        { title: "User Activity Log", date: "Aug 2023", size: "5.7 MB", type: "CSV" },
    ];

    return (
        <div className="space-y-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-foreground uppercase italic leading-none mb-3">Intelligence<br />Reports</h1>
                    <p className="text-sm text-muted-foreground font-medium tracking-wide">Automated data synthesis and performance metrics.</p>
                </div>
                <button className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 flex items-center gap-3">
                    <Zap size={16} /> Generate New
                </button>
            </header>

            {/* --- ANALYTICS PREVIEW --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={120} className="text-foreground" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <h3 className="text-lg font-black text-foreground uppercase italic mb-8 flex items-center gap-3">
                            <BarChart3 size={20} /> Data Velocity
                        </h3>
                        <div className="flex-1 min-h-[200px] flex items-center justify-center border border-white/5 rounded-3xl bg-white/[0.02]">
                            <p className="text-xs text-muted-foreground uppercase tracking-[0.4em] font-black animate-pulse">Syncing Analytics...</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-md flex flex-col justify-center">
                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.3em] mb-4">Storage Integrity</p>
                    <p className="text-2xl font-black text-foreground tracking-tighter mb-2">99.8%</p>
                    <p className="text-xs text-muted-foreground font-medium">All systems operational.</p>
                </div>
            </div>

            {/* --- ARCHIVE LIST --- */}
            <div className="space-y-4">
                <h3 className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.5em] mb-6">Recent Archives</h3>
                {reportCards.map((r) => (
                    <div key={r.title} className="group flex items-center gap-8 p-6 bg-card/20 backdrop-blur-xl border border-white/5 rounded-[32px] hover:bg-card/40 hover:border-white/10 transition-all cursor-pointer">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-105 transition-all">
                            <FileText className="text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-foreground tracking-tight">{r.title}</h4>
                            <p className="text-xs text-muted-foreground font-medium">{r.date} • {r.size}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-[10px] font-black uppercase text-muted-foreground tracking-widest">{r.type}</div>
                            <button className="p-3 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-foreground"><Download size={20} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
