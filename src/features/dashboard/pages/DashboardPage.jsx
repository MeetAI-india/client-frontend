import React from "react";
import { Briefcase, Users, Video, CalendarCheck } from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { label: "Total Projects", value: "5", icon: Briefcase, trend: "+2" },
        { label: "Active Meetings", value: "3", icon: Video, trend: "+1" },
        { label: "Team Members", value: "6", icon: Users, trend: "+2" },
        { label: "Meetings This Week", value: "4", icon: CalendarCheck, trend: "-1" },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header - Matching Pipeline Header Style */}
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    Overview
                </h1>
                <p className="text-white/40 font-medium">
                    MeetAi - Monitor your projects and meetings.
                </p>
            </header>

            {/* Metrics - Using Pipeline Card Styles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="group relative bg-white/[0.08] border border-white/[0.15] p-5 rounded-2xl cursor-default hover:bg-white/[0.12] hover:-translate-y-1 transition-all shadow-lg"
                    >
                        {/* Pipeline Card Inner Glow Effect */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none rounded-2xl" />

                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 bg-white/[0.08] border border-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <stat.icon size={18} className="text-white/80" />
                                </div>
                                <span className={`text-[10px] font-black px-2 py-1 rounded ${stat.trend.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-lg font-black text-white tracking-tight">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Graph - Using Pipeline Column Container Style */}
                <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-5 transition-colors">
                    <h3 className="font-black text-white text-lg tracking-tight mb-6">Meeting Activity</h3>
                    <div className="h-64 w-full flex items-end justify-between gap-3 px-2">
                        {[2, 4, 1, 5, 3, 0, 1].map((h, i) => (
                            <div key={i} className="w-full relative group flex justify-center">
                                <div
                                    className="w-full max-w-[48px] bg-white/[0.08] border border-white/20 rounded-t-xl transition-all duration-300 group-hover:bg-white/[0.15]"
                                    style={{ height: `${Math.max(h * 18, 4)}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                                </div>
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs py-1 px-2 rounded font-bold pointer-events-none">
                                    {h} meetings
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-bold text-white/40 uppercase tracking-widest px-2">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Recent Activity - Using Pipeline Column Container Style */}
                <div className="bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-5 transition-colors">
                    <h3 className="font-black text-white text-lg tracking-tight mb-6 flex items-center gap-3">
                        Recent Activity
                    </h3>
                    <div className="space-y-5">
                        {[
                            { title: "Meeting completed: Kickoff Sync", time: "2h ago", type: "success" },
                            { title: "New project created: Mobile App v2", time: "4h ago", type: "info" },
                            { title: "Member added to Website Revamp", time: "5h ago", type: "info" },
                            { title: "Meeting scheduled: Design Review", time: "1d ago", type: "info" }
                        ].map((act, i) => (
                            <div key={i} className="flex gap-4 items-start group">
                                <div className="relative mt-1">
                                    <div className="w-3 h-3 rounded-full bg-white border border-white/30 z-10 relative group-hover:scale-125 transition-transform" />
                                    {i < 3 && <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-white/10" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white mb-1 group-hover:text-white/80 transition-colors">
                                        {act.title}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">
                                        {act.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-1.5 border border-dashed border-white/20 rounded-2xl text-white/40 text-xs font-bold uppercase tracking-widest hover:bg-white/[0.05] hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
}