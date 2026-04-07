import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, MoreVertical, ArrowUpRight, LayoutGrid } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import TabBar from "@/components/TabBar";
import Badge from "@/components/Badge";

export default function ProjectsPage() {
    const [activeTab, setActiveTab] = useState('Active');
    const navigate = useNavigate();

    const allProjects = [
        { id: 1, name: "MeetAI Dashboard", description: "UI/UX Redesign and Dark Mode", progress: 75, importance: "High", status: "Active" },
        { id: 2, name: "Edge API Gateway", description: "High performance API routing", progress: 30, importance: "Medium", status: "Active" },
        { id: 3, name: "Security Audit", description: "Vulnerability analysis and compliance", progress: 100, importance: "Critical", status: "Completed" },
        { id: 4, name: "Legacy Migration", description: "Old system data transfer", progress: 10, importance: "Low", status: "On Hold" },
    ];

    const tabs = [
        { label: "Active", count: allProjects.filter(p => p.status === "Active").length },
        { label: "On Hold", count: allProjects.filter(p => p.status === "On Hold").length },
        { label: "Completed", count: allProjects.filter(p => p.status === "Completed").length },
    ];

    const filteredProjects = allProjects.filter(p => p.status === activeTab);

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="mb-8">
                {/* Flex container to align Title and Button */}
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-black tracking-tight text-white underline decoration-white/10 underline-offset-8">
                        Projects
                    </h1>
                    <Button>+ New Project</Button>
                </div>
                <p className="text-white/40 font-medium">
                    Keep track of your current high-priority initiatives.
                </p>
            </header>

            {/* Full Width TabBar */}
            <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((p) => (
                        <Card
                            key={p.id}
                            onClick={() => navigate(`/projects/${p.id}`)}
                            className="flex flex-col p-5 hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Briefcase size={22} className="text-white" />
                                </div>
                                <button className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="flex-1 mb-6">
                                <h3 className="font-bold text-white mb-1 leading-tight flex items-center gap-2">
                                    {p.name}
                                    {p.importance === 'Critical' && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                                </h3>
                                <p className="text-sm text-white/50 leading-relaxed">{p.description}</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-end justify-between">
                                    <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">Velocity</p>
                                    <p className="text-sm font-black text-white">{p.progress}%</p>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${p.status === 'Completed' ? 'bg-green-400' : 'bg-white'}`}
                                        style={{ width: `${p.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                                <Badge variant={p.importance.toLowerCase()}>
                                    {p.importance}
                                </Badge>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/projects/${p.id}`);
                                    }}
                                    className="px-3 py-1.5 text-xs font-bold text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                    Access <ArrowUpRight size={12} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/[0.03] border border-white/10 rounded-[30px]">
                    <LayoutGrid size={32} className="mx-auto text-white/20 mb-4" />
                    <p className="text-white/40 font-bold">No projects found in this category.</p>
                </div>
            )}
        </div>
    );
}