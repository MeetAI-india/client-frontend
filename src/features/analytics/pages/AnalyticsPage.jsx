import React from "react";
import { Activity, ArrowUpRight, BarChart2 } from "lucide-react";
import Card from "@/components/Card";

export default function AnalyticsPage() {
    return (
        <div className="h-full flex flex-col animate-fade-in space-y-8">
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    Analytics Intelligence
                </h1>
                <p className="text-white/40 font-medium">
                    Deep dive into conversion metrics and funnel analysis.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Funnel Chart Container - Styled like Pipeline Column */}
                <Card className="p-5 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-white text-lg tracking-tight">Sales Funnel</h3>
                        <div className="p-2 bg-white/[0.08] rounded-xl border border-white/10">
                            <BarChart2 className="text-white/60" size={18} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 pt-2">
                        {/* Funnel Step 1 - Styled like Pipeline Deal Card */}
                        <div className="w-full relative group">
                            <Card className="flex items-center justify-between px-6 py-4">
                                <span className="font-bold text-white tracking-widest uppercase text-[10px] relative z-10">Leads</span>
                                <span className="font-black text-sm text-white relative z-10">4,205</span>
                            </Card>
                        </div>

                        {/* Funnel Step 2 */}
                        <div className="w-[85%] relative group">
                            <Card className="flex items-center justify-between px-6 py-4">
                                <span className="font-bold text-white tracking-widest uppercase text-[10px] relative z-10">Qualified</span>
                                <span className="font-black text-sm text-white relative z-10">1,840</span>
                            </Card>
                        </div>

                        {/* Funnel Step 3 */}
                        <div className="w-[60%] relative group">
                            <Card className="flex items-center justify-between px-6 py-4">
                                <span className="font-bold text-white tracking-widest uppercase text-[10px] relative z-10">Proposals</span>
                                <span className="font-black text-sm text-white relative z-10">620</span>
                            </Card>
                        </div>

                        {/* Funnel Step 4 (Bottom) */}
                        <div className="w-[40%] relative group">
                            <div className="bg-gradient-to-r from-white/[0.15] to-white/[0.05] border border-white/20 rounded-2xl flex items-center justify-between px-6 py-4 shadow-lg hover:border-white/30 transition-all">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none rounded-2xl" />
                                <span className="font-bold text-white tracking-widest uppercase text-[10px] relative z-10">Closed</span>
                                <span className="font-black text-sm text-white relative z-10">214</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Additional Metrics */}
                <div className="flex flex-col gap-6">
                    {/* Win Rate Card - Styled like Pipeline Deal Card */}
                    <Card className="p-5">
                        <div className="relative z-10">
                            <h4 className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">Win Rate</h4>
                            <div className="flex items-end gap-4">
                                <span className="text-lg font-black text-white tracking-tighter">34.5%</span>
                                <span className="flex items-center text-green-400 font-bold mb-1 text-sm">
                                    <ArrowUpRight size={16} /> 4.2%
                                </span>
                            </div>
                            <p className="mt-3 text-xs text-white/50 font-bold">Industry average: 21.0%</p>
                        </div>
                    </Card>

                    {/* Deal Velocity Card - Styled like Pipeline Deal Card */}
                    <Card className="p-5 flex-1 flex flex-col justify-center">
                        <div className="relative z-10">
                            <h4 className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">Deal Velocity</h4>
                            <div className="flex items-end gap-4">
                                <span className="text-lg font-black text-white tracking-tighter">18.2</span>
                                <span className="text-white/40 font-bold mb-1 uppercase tracking-widest text-sm">Days</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                                <div className="h-full bg-white/80 w-[45%] rounded-full" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}