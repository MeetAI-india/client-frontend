import React from "react";
import { Calendar, Clock, Info, Hash } from "lucide-react";
import Badge from "@/components/Badge";

export default function MeetingInfoTab({ meeting, formattedDate }) {
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="max-w-4xl animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Meta Column */}
                <div className="space-y-6">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Metadata</h3>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white/40 uppercase mb-1">Scheduled Time</p>
                                <p className="text-white font-medium">{formattedDate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 text-purple-400">
                                <Clock size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white/40 uppercase mb-1">Duration / End Time</p>
                                <p className="text-white font-medium">
                                    {meeting.ended_at ? formatDate(meeting.ended_at) : "In progress / Not ended"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center flex-shrink-0 text-gray-400">
                                <Hash size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white/40 uppercase mb-1">Meeting ID</p>
                                <p className="text-white/70 font-mono text-sm">{meeting.id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Column */}
                <div className="space-y-6">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Description</h3>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[200px]">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-400">
                                <Info size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-white/40 uppercase mb-2">Agenda / Notes</p>
                                <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                                    {meeting.description ? (
                                        meeting.description
                                    ) : (
                                        <span className="text-white/30 italic">No description or agenda provided for this meeting.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-bold text-white/30 uppercase">Access Level:</span>
                        <Badge variant="default" className="text-xs font-medium">
                            {meeting.access_level?.replace("_", " ") || "Standard"}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}