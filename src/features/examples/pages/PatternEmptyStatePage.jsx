import { Inbox } from "lucide-react";

export default function PatternEmptyStatePage() {
    return (
        <div className="h-full flex flex-col animate-fade-in">
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    Pattern: Empty State
                </h1>
                <p className="text-white/40 font-medium">
                    Placeholder content for an empty state page.
                </p>
            </header>
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                        <Inbox size={24} className="text-white/20" />
                    </div>
                    <p className="text-white/30 text-sm font-medium">Nothing here yet.</p>
                </div>
            </div>
        </div>
    );
}
