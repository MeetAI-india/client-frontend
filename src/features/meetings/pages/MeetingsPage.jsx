import React from "react";
import { Plus, Search, Calendar, Filter } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

export default function MeetingsPage() {
    const meetings = [
        { id: 1, title: "Product Sync", date: "Oct 24", time: "10:30 AM", status: "In Progress", members: ["A", "B", "C"] },
        { id: 2, title: "Client Kickoff", date: "Oct 24", time: "02:00 PM", status: "Upcoming", members: ["D", "E"] },
        { id: 3, title: "Design Review", date: "Oct 25", time: "11:00 AM", status: "Draft", members: ["F", "G", "H"] },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                        Meetings
                    </h1>
                    <p className="text-white/40 font-medium">
                        Manage and organize your AI-summarized meetings.
                    </p>
                </div>
                <Button onClick={() => { }}>
                    <Plus size={14} /> New Meeting
                </Button>
            </header>

            {/* Main Container - Styled like Pipeline Column */}
            <div className="bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-5 transition-colors">

                {/* Section Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-white text-lg tracking-tight flex items-center gap-3">
                        Session Registry
                    </h3>
                    <div className="flex items-center gap-2">
                        <button className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Filter size={18} />
                        </button>
                        <button className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                {/* Cards Container */}
                <div className="flex flex-col gap-4">
                    {meetings.map((m) => (
                        <Card
                            key={m.id}
                            className="p-5"
                        >
                            <div className="relative z-10 flex items-center gap-5">
                                {/* Icon / Date Block */}
                                <div className="w-12 h-12 bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                    <Calendar size={22} className="text-white/80" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white mb-1 leading-tight">{m.title}</h4>
                                    <p className="text-xs text-white/50 font-medium">
                                        {m.date} at {m.time}
                                    </p>
                                </div>

                                {/* Members */}
                                <div className="hidden md:flex items-center -space-x-2 flex-shrink-0">
                                    {m.members.map((mem, idx) => (
                                        <div key={idx} className="w-6 h-6 rounded-full bg-white/20 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                                            {mem}
                                        </div>
                                    ))}
                                </div>

                                {/* Status Tag */}
                                <Badge variant={m.status === 'In Progress' ? 'success' : m.status === 'Upcoming' ? 'medium' : 'default'}>
                                    {m.status}
                                </Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}