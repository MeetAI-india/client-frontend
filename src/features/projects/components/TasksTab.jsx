import React from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import { CheckCircle2, Circle, Plus } from "lucide-react";

const DEFAULT_TASKS = [
    { id: 1, title: "Finalize color palette", priority: "High", completed: false, due: "Today" },
    { id: 2, title: "Review API integration", priority: "Medium", completed: true, due: "Completed" },
    { id: 3, title: "Update wireframes", priority: "Low", completed: false, due: "Tomorrow" },
];

export default function TasksTab() {
    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="font-bold text-white text-lg tracking-tight">Active Tasks</h3>
            </div>

            <div className="flex flex-col gap-3">
                {DEFAULT_TASKS.map((task) => (
                    <Card
                        key={task.id}
                        className={`p-5 transition-all ${task.completed ? "opacity-40 hover:opacity-60" : "hover:-translate-y-0.5"}`}
                    >
                        <div className="flex items-center gap-4">
                            <button className="text-white/40 hover:text-white transition-colors mt-0.5 flex-shrink-0">
                                {task.completed
                                    ? <CheckCircle2 size={22} className="text-green-400" />
                                    : <Circle size={22} />}
                            </button>

                            <div className="flex-1 min-w-0">
                                <p className={`font-bold text-white mb-1 transition-all ${task.completed ? "line-through text-white/60" : ""}`}>
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
    );
}