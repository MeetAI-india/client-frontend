import React from "react";
import Card from "@/components/Card";
import { Briefcase, CheckCircle } from "lucide-react";

export default function ProjectInfoTab({ project, uiStatus, formattedDeadline }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full auto-rows-fr">
            <Card className="flex flex-col p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-lg tracking-tight">Dashboard Overview</h3>
                    <Briefcase size={20} className="text-white/40" />
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                        <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Status</span>
                        <span className="text-lg font-black text-white">{uiStatus}</span>
                    </div>
                    <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                        <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Project ID</span>
                        <span className="text-sm font-black text-white break-all text-right">{project?.id}</span>
                    </div>
                    <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                        <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Deadline</span>
                        <span className="text-lg font-black text-white text-right">{formattedDeadline}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Availability</span>
                        <span className="text-lg font-black text-white">
                            {project?.is_active ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </Card>

            <Card className="flex flex-col p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-lg tracking-tight">Project Details</h3>
                    <CheckCircle size={20} className="text-green-400" />
                </div>

                <div className="flex-1 flex flex-col justify-start space-y-6">
                    <div className="space-y-2 border-b border-white/5 pb-4">
                        <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Short Description</span>
                        <p className="text-sm text-white/80 leading-relaxed">
                            {project?.short_description || "No short description available yet."}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Description</span>
                        <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                            {project?.description || "No detailed description available yet."}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}