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
            <header className="mb-5 flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-white mb-1 underline decoration-white/10 underline-offset-8">
                        Tasks & Activities
                    </h1>
                    <p className="text-sm text-white/40 font-medium">
                        Focus on what matters most.
                    </p>
                </div>
                <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-lg">
                    <button
                        onClick={() => setView('list')}
                        className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <ListIcon size={14} />
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`p-1.5 rounded-md transition-all ${view === 'calendar' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <CalIcon size={14} />
                    </button>
                </div>
            </header>

            <div className="flex gap-3 mb-4">
                <Button onClick={() => { }}>+ New Task</Button>
                <div className="flex-1" />
                <button className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.10] rounded-lg flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/[0.08] transition-all">
                    <Filter size={13} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Filter</span>
                </button>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.1] rounded-[20px] p-4 flex-1 transition-colors overflow-y-auto">
                {view === 'list' ? (
                    <div className="flex flex-col gap-2">
                        {tasks.map(task => (
                            <Card
                                key={task.id}
                                className={`p-3.5 transition-all ${task.completed ? 'opacity-40 hover:opacity-60' : ''}`}
                            >
                                <div className="relative z-10 flex items-center gap-3">
                                    <button onClick={() => toggleTask(task.id)} className="text-white/40 hover:text-white transition-colors flex-shrink-0">
                                        {task.completed
                                            ? <CheckCircle2 size={15} className="text-green-400" />
                                            : <Circle size={15} />
                                        }
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold text-white mb-0.5 transition-all ${task.completed ? 'line-through text-white/60' : ''}`}>
                                            {task.title}
                                        </p>
                                        <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                            <span className="flex items-center gap-1"><Clock size={10} /> {task.due}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span>{task.project}</span>
                                        </div>
                                    </div>

                                    <Badge variant={task.priority.toLowerCase()}>
                                        {task.priority}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-white/40 flex-col gap-3">
                        <CalIcon size={20} className="opacity-30" />
                        <p className="text-sm font-bold">Calendar view coming soon</p>
                        <p className="text-xs text-white/20">Track deadlines visually in future updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
