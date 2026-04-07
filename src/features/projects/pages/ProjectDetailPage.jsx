import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Users, Calendar, Info, CheckCircle,
    Briefcase, Plus, Edit, MoreVertical, Mail,
    CheckCircle2, Circle, ListTodo
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import TabBar from "@/components/TabBar";
import Badge from "@/components/Badge";

export default function ProjectDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Info');

    const project = {
        name: "MeetAI Dashboard",
        description: "A comprehensive UI/UX redesign focusing on dark mode aesthetics and AI integration.",
        status: "Active",
        progress: 75,
        velocity: "Fast",
        budget: "$24,500",
    };

    const team = [
        { id: 1, name: "Alice Freeman", role: "Lead Designer", email: "alice@meet.ai", status: "Active" },
        { id: 2, name: "Bob Smith", role: "Frontend Engineer", email: "bob@meet.ai", status: "Active" },
        { id: 3, name: "Charlie Davis", role: "Project Manager", email: "charlie@meet.ai", status: "Away" },
    ];

    const tasks = [
        { id: 1, title: "Finalize color palette", priority: "High", completed: false, due: "Today" },
        { id: 2, title: "Review API integration", priority: "Medium", completed: true, due: "Completed" },
        { id: 3, title: "Update wireframes", priority: "Low", completed: false, due: "Tomorrow" },
    ];

    const tabs = [
        { id: 'Info', label: 'Project Info', icon: Info },
        { id: 'Team', label: 'Team Members', icon: Users },
        { id: 'Tasks', label: 'Tasks', icon: ListTodo },
        { id: 'Meetings', label: 'Meetings', icon: Calendar },
    ];

    return (
        <div className="h-full flex flex-col animate-fade-in">
            <header className="mb-8 flex-shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    <ArrowLeft size={14} /> Back to Projects
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                            {project.name}
                        </h1>
                        <p className="text-white/40 font-medium max-w-xl">
                            {project.description}
                        </p>
                    </div>
                    <Button><Edit size={14} /> Edit Project</Button>
                </div>
            </header>

            {/* Removed w-fit to allow full width */}
            <div className="mb-6 flex-shrink-0">
                <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-5 transition-colors overflow-y-auto">

                {activeTab === 'Info' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full auto-rows-fr">
                        <Card className="flex flex-col p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-white text-lg tracking-tight">Dashboard Overview</h3>
                                <Briefcase size={20} className="text-white/40" />
                            </div>

                            <div className="flex-1 flex flex-col justify-center space-y-6">
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                                    <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Status</span>
                                    <span className="text-lg font-black text-white">{project.status}</span>
                                </div>
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                                    <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Budget Used</span>
                                    <span className="text-lg font-black text-white">{project.budget}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Velocity</span>
                                    <span className="text-lg font-black text-white">{project.velocity}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="flex flex-col p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-white text-lg tracking-tight">Completion</h3>
                                <CheckCircle size={20} className="text-green-400" />
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                <div className="text-center mb-8">
                                    <span className="text-6xl font-black text-white">{project.progress}%</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-white/50 text-center mt-2">
                                        Estimated completion: 2 weeks
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'Team' && (
                    <div className="h-full flex flex-col gap-4">
                        <div className="flex items-center text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/10 pb-3 px-2">
                            <div className="w-8"></div>
                            <div className="flex-1">Member</div>
                            <div className="w-32 hidden md:block">Role</div>
                            <div className="w-24 hidden md:block">Status</div>
                            <div className="w-28 text-right">Actions</div>
                        </div>

                        {team.map((member) => (
                            <Card key={member.id} className="flex items-center p-4 gap-4 hover:-translate-y-0.5">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold text-white border border-white/10 flex-shrink-0">
                                    {member.name.charAt(0)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white truncate">{member.name}</h4>
                                    <p className="text-xs text-white/40 truncate">{member.email}</p>
                                </div>

                                <div className="w-32 hidden md:block">
                                    <span className="text-xs text-white/60 font-medium">{member.role}</span>
                                </div>

                                <div className="w-24 hidden md:flex items-center">
                                    <Badge variant={member.status === 'Active' ? 'success' : 'high'}>
                                        {member.status}
                                    </Badge>
                                </div>

                                <div className="w-28 flex items-center justify-end gap-1 flex-shrink-0">
                                    <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                        <Mail size={16} />
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </Card>
                        ))}

                        <button className="w-full mt-2 py-3 border border-dashed border-white/20 rounded-2xl text-white/40 text-xs font-bold uppercase tracking-widest hover:bg-white/[0.05] hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                            <Plus size={14} /> Add Team Member
                        </button>
                    </div>
                )}

                {activeTab === 'Tasks' && (
                    <div className="h-full flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2 px-2">
                            <h3 className="font-bold text-white text-lg tracking-tight">Active Tasks</h3>
                            <Button variant="secondary"><Plus size={12} /> Add Task</Button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {tasks.map(task => (
                                <Card
                                    key={task.id}
                                    className={`p-5 transition-all ${task.completed ? 'opacity-40 hover:opacity-60' : 'hover:-translate-y-0.5'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <button className="text-white/40 hover:text-white transition-colors mt-0.5 flex-shrink-0">
                                            {task.completed ? <CheckCircle2 size={22} className="text-green-400" /> : <Circle size={22} />}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <p className={`font-bold text-white mb-1 transition-all ${task.completed ? 'line-through text-white/60' : ''}`}>
                                                {task.title}
                                            </p>
                                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                                {task.due}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <Badge variant={task.priority.toLowerCase()}>
                                                {task.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Meetings' && (
                    <div className="h-full flex flex-col gap-4">
                        {['Sprint Planning', 'Design Review', 'Client Sync'].map((meet, i) => (
                            <Card key={i} className="flex items-center p-5 gap-5 hover:-translate-y-0.5 cursor-pointer">
                                <div className="w-10 h-10 bg-white/[0.08] border border-white/10 rounded-xl flex items-center justify-center text-white/80">
                                    <Calendar size={18} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{meet}</h4>
                                    <p className="text-xs text-white/50">Oct 2{i + 4}, 2024</p>
                                </div>
                                <Badge>Upcoming</Badge>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}