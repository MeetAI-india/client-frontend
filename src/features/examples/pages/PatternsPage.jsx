import { Link } from "react-router-dom";

const PATTERNS = [
    { name: "Loading", path: "/examples/patterns/loading", color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
    { name: "Empty State", path: "/examples/patterns/empty-state", color: "bg-amber-500/20 border-amber-500/30 text-amber-400" },
    { name: "Error State", path: "/examples/patterns/error-state", color: "bg-red-500/20 border-red-500/30 text-red-400" },
];

export default function PatternsPage() {
    return (
        <div className="h-full flex flex-col animate-fade-in">
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    Patterns
                </h1>
                <p className="text-white/40 font-medium">
                    Common UI patterns. Click a child to see its dedicated page.
                </p>
            </header>
            <div className="flex-1 grid grid-cols-3 gap-6 auto-rows-min">
                {PATTERNS.map((p) => (
                    <Link
                        key={p.name}
                        to={p.path}
                        className="bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-6 hover:bg-white/[0.06] transition-all flex flex-col items-center justify-center gap-3 h-32"
                    >
                        <div className={`w-10 h-10 rounded-xl ${p.color} border flex items-center justify-center text-xs font-black`}>
                            {p.name.charAt(0)}
                        </div>
                        <span className="text-white font-bold text-sm">{p.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
