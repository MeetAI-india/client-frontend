import { AlertCircle } from "lucide-react";

export default function PatternErrorStatePage() {
    return (
        <div className="h-full flex flex-col animate-fade-in">
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    Pattern: Error State
                </h1>
                <p className="text-white/40 font-medium">
                    Placeholder content for an error state page.
                </p>
            </header>
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertCircle size={24} className="text-red-400" />
                    </div>
                    <p className="text-white/30 text-sm font-medium">Something went wrong.</p>
                </div>
            </div>
        </div>
    );
}
