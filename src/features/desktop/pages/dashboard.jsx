import React from "react";
import { TrendingUp, Users, Clock, Activity } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function DashboardPage() {
    const stats = [
        { label: "Total Meetings", value: "24", icon: Users },
        { label: "Hours Saved", value: "128h", icon: Clock },
        { label: "Active Projects", value: "6", icon: TrendingUp },
        { label: "Team Velocity", value: "94%", icon: Activity },
    ];

    return (
        <div className="space-y-10">

            {/* 🔥 HEADER */}
            <header>
                <h1 className="
                    text-3xl font-black tracking-tight text-white mb-2
                    underline decoration-white/10 underline-offset-8
                ">
                    Dashboard Overview
                </h1>
                <p className="text-white/40 font-medium">
                    Welcome back! Here's a look at your current productivity.
                </p>
            </header>

            {/* 🧊 STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card
                        key={stat.label}
                        className="p-8 backdrop-blur-[30px] border-white/[0.25] shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
                    >
                        {/* ✨ Light reflection */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent opacity-30" />

                        {/* 🌫 Noise */}
                        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

                        <div className="relative z-10 flex flex-col gap-4">
                            {/* Icon */}
                            <div className="w-12 h-12 bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <stat.icon size={22} className="text-white" />
                            </div>

                            {/* Text */}
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-black text-white tracking-tighter">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 📊 CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 🧊 RECENT ACTIVITY */}
                <div className="
                    lg:col-span-2
                    bg-white/[0.12]
                    border border-white/[0.25]
                    backdrop-blur-[30px]
                    p-8
                    rounded-[40px]
                ">
                    <h3 className="text-xl font-bold mb-6 text-white">
                        Recent Activity
                    </h3>

                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="
                                    flex items-center gap-4
                                    p-4
                                    rounded-2xl
                                    bg-white/[0.04]
                                    border border-white/10
                                    hover:bg-white/[0.08]
                                    hover:border-white/20
                                    transition-all
                                    group
                                "
                            >
                                <div className="
                                    w-12 h-12 rounded-full
                                    bg-white/[0.08]
                                    flex items-center justify-center
                                ">
                                    <Activity size={20} className="text-white/40 group-hover:text-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white mb-1 leading-none">
                                        Sprint Planning Session {i}
                                    </p>
                                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                                        Today • 10:00 AM
                                    </p>
                                </div>

                                {/* 🔘 Use YOUR button system */}
                                <Button variant="primary" className="px-4 py-2 rounded-full">
                                    Details
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 💡 SIDE CARD */}
                <div className="
                    bg-white/[0.12]
                    border border-white/[0.25]
                    backdrop-blur-[30px]
                    p-8
                    rounded-[40px]
                    shadow-[0_8px_40px_rgba(0,0,0,0.45)]
                    flex flex-col justify-between
                ">
                    <div>
                        <h3 className="
                            text-xl font-bold mb-4 text-white
                            underline decoration-white/10 underline-offset-8
                        ">
                            Quick Tip
                        </h3>

                        <p className="text-white/40 leading-relaxed text-sm">
                            Use <strong className="text-white">AI Summaries</strong> to get the gist of your meetings in minutes 🚀
                        </p>
                    </div>

                    {/* 📊 CREDIT CARD */}
                    <div className="
                        mt-8 p-6
                        bg-white/[0.08]
                        border border-white/10
                        rounded-3xl
                    ">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">
                                    Active Credits
                                </p>
                                <p className="text-2xl font-bold text-white tracking-tighter">
                                    482 / 500
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-white/60 text-xs font-bold">
                                    +12%
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}