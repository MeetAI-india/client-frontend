import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const TASKS = [
    { title: "Review meeting transcript", meeting: "Sprint Planning", due: "Today", status: "pending" },
    { title: "Summarize action items", meeting: "Client Call", due: "Tomorrow", status: "done" },
    { title: "Follow up on decisions", meeting: "Design Review", due: "Jul 10", status: "overdue" },
];

export default function MeetingTasksPage() {
    const statusIcon = (s) => {
        switch (s) {
            case "done": return <CheckCircle size={14} className="text-emerald-400" />;
            case "overdue": return <AlertCircle size={14} className="text-red-400" />;
            default: return <Clock size={14} className="text-amber-400" />;
        }
    };

    return (
        <div className="h-full flex flex-col animate-fade-in">
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    Meeting Tasks
                </h1>
                <p className="text-white/40 font-medium">
                    Action items and follow-ups from meetings.
                </p>
            </header>
            <div className="flex-1 flex flex-col gap-2 max-w-xl">
                {TASKS.map((t, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-4 flex items-center gap-4">
                        {statusIcon(t.status)}
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-sm leading-tight">{t.title}</p>
                            <p className="text-white/40 text-xs mt-0.5">{t.meeting} · {t.due}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
