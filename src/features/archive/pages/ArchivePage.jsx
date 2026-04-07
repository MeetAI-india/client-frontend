import React from 'react';
import { Archive, Search, Filter, RefreshCw, Trash2, ShieldCheck } from 'lucide-react';

export default function ArchivePage() {
    const logs = [
        { id: "LOG-928", name: "Alpha Sector Reboot", date: "2023.08.12", security: "Vaulted" },
        { id: "LOG-441", name: "Neural Training Session", date: "2023.07.05", security: "High" },
        { id: "LOG-112", name: "System Wide Audit", date: "2023.06.22", security: "Standard" },
    ];

    return (
        <div className="space-y-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic leading-none mb-3">Historical<br />Archive</h1>
                    <p className="text-sm text-muted-foreground font-medium tracking-wide">Secure vault of all legacy operations and sessions.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="QUERY ARCHIVE..."
                            className="bg-white/5 border border-white/5 focus:border-white/20 rounded-2xl pl-12 pr-6 py-4 text-xs font-black uppercase tracking-widest outline-none transition-all w-64"
                        />
                    </div>
                    <button className="p-4 bg-white/5 border border-white/5 rounded-2xl text-muted-foreground hover:text-foreground transition-all"><Filter size={20} /></button>
                </div>
            </header>

            {/* --- ARCHIVE TABLE --- */}
            <div className="bg-card/30 backdrop-blur-3xl border border-white/5 rounded-[48px] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 border border-white/5 rounded-[48px] pointer-events-none" />

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Log ID</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Operation Name</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Timestamp</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Security</th>
                            <th className="p-8 text-right text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="relative z-10">
                        {logs.map((L) => (
                            <tr key={L.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 cursor-pointer">
                                <td className="p-8 font-black text-muted-foreground tracking-widest text-xs">{L.id}</td>
                                <td className="p-8">
                                    <p className="font-black text-foreground tracking-tight">{L.name}</p>
                                </td>
                                <td className="p-8 text-xs text-muted-foreground font-semibold">{L.date}</td>
                                <td className="p-8">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
                                        <ShieldCheck size={12} className="text-white" />
                                        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{L.security}</span>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-3 bg-white/5 rounded-xl text-muted-foreground hover:text-foreground transition-all"><RefreshCw size={16} /></button>
                                        <button className="p-3 bg-white/5 rounded-xl text-muted-foreground hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- VACUUM NOTICE --- */}
            <div className="text-center">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.8em] opacity-40">Deep Archive Protocol Stable</p>
            </div>
        </div>
    );
}
