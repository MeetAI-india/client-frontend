import React, { useState } from "react";
import { CheckCircle2, Circle, Clock, Filter, List as ListIcon, Calendar as CalIcon } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

export default function TasksPage() {
    const [view, setView] = useState('list');
    const [tasks, setTasks] = useState([
        { id: 1, title: "Review Q3 Marketing Analytics", due: "Today", priority: "High", completed: false, project: "Internal" },
        { id: 2, title: "Follow up with Wayne Enterprises", due: "Tomorrow", priority: "High", completed: false, project: "Sales" },
        { id: 3, title: "Draft Proposal for Stark Ind.", due: "Next Week", priority: "Medium", completed: false, project: "Sales" },
        { id: 4, title: "Update CRM configuration", due: "Next Week", priority: "Low", completed: true, project: "IT" },
    ]);

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    return (
        <div className="h-full flex flex-col animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                        Tasks & Activities
                    </h1>
                    <p className="text-white/40 font-medium">
                        Focus on what matters most.
                    </p>
                </div>
                <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-xl">
                    <button
                        onClick={() => setView('list')}
                        className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <ListIcon size={18} />
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`p-2 rounded-lg transition-all ${view === 'calendar' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <CalIcon size={18} />
                    </button>
                </div>
            </header>

            <div className="flex gap-4 mb-6">
                <Button onClick={() => { }}>
                    + New Task
                </Button>
                <div className="flex-1" />
                <button className="px-4 py-3 bg-white/[0.05] border border-white/[0.10] rounded-xl flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/[0.08] transition-all">
                    <Filter size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Filter</span>
                </button>
            </div>

            {/* Main Container - Styled like Pipeline Column (Full Width) */}
            <div className="bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-5 flex-1 transition-colors overflow-y-auto">
                {view === 'list' ? (
                    <div className="flex flex-col gap-4">
                        {tasks.map(task => (
                            <Card
                                key={task.id}
                                className={`p-5 transition-all ${task.completed ? 'opacity-40 hover:opacity-60' : ''}`}
                            >
                                <div className="relative z-10 flex items-center gap-4">
                                    <button onClick={() => toggleTask(task.id)} className="text-white/40 hover:text-white transition-colors mt-0.5 flex-shrink-0">
                                        {task.completed ? <CheckCircle2 size={22} className="text-green-400" /> : <Circle size={22} />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <p className={`font-bold text-white mb-1 transition-all ${task.completed ? 'line-through text-white/60' : ''}`}>
                                            {task.title}
                                        </p>
                                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                            <span className="flex items-center gap-1.5"><Clock size={12} /> {task.due}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>{task.project}</span>
                                        </div>
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
                ) : (
                    <div className="h-full flex items-center justify-center text-white/40 flex-col gap-4">
                        <CalIcon size={48} className="opacity-30" />
                        <p className="font-bold text-lg">Calendar view coming soon</p>
                        <p className="text-xs text-white/20">Track deadlines visually in future updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
}