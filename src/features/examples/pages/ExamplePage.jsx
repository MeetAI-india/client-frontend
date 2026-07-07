import { FileText, Layers, LayoutGrid, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const OVERVIEW = [
    {
        icon: Layers, label: "UI Kit", path: "/examples/ui-kit",
        desc: "Buttons, inputs, badges, cards, and other reusable components.",
    },
    {
        icon: LayoutGrid, label: "Patterns", path: "/examples/patterns",
        desc: "Loading, empty state, error state — common UI patterns.",
        children: [
            { name: "Loading", path: "/examples/patterns/loading" },
            { name: "Empty State", path: "/examples/patterns/empty-state" },
            { name: "Error State", path: "/examples/patterns/error-state" },
        ],
    },
];

export default function ExamplePage() {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col animate-fade-in">
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    Examples
                </h1>
                <p className="text-white/40 font-medium">
                    Reference patterns for building new features. Each section, sub-item, and child opens a different page.
                </p>
            </header>

            <div className="flex-1 grid grid-cols-2 gap-6 auto-rows-min">
                {OVERVIEW.map((section) => (
                    <div
                        key={section.label}
                        onClick={() => navigate(section.path)}
                        onKeyDown={(e) => e.key === "Enter" && navigate(section.path)}
                        tabIndex={0}
                        role="button"
                        className="group bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-6 hover:bg-white/[0.06] transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                                <section.icon size={18} className="text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold">{section.label}</h2>
                                <p className="text-white/30 text-xs">{section.path}</p>
                            </div>
                            <ChevronRight size={16} className="ml-auto text-white/20 group-hover:text-white/60 transition-colors shrink-0" />
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed mb-4">{section.desc}</p>
                        {section.children && (
                            <div className="flex gap-2 flex-wrap border-t border-white/[0.06] pt-3">
                                {section.children.map((c) => (
                                    <Link
                                        key={c.name}
                                        to={c.path}
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 text-xs font-semibold hover:bg-white/[0.08] hover:text-white/70 transition-colors"
                                    >
                                        {c.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
