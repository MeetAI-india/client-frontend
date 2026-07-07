export default function UIKitPage() {
    const items = ["Button", "Input", "Badge", "Card", "Modal", "Dropdown"];
    return (
        <div className="h-full flex flex-col animate-fade-in">
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    UI Kit
                </h1>
                <p className="text-white/40 font-medium">
                    Reusable components available in <code className="text-indigo-400">src/components/</code>.
                </p>
            </header>
            <div className="flex-1 grid grid-cols-3 gap-4 auto-rows-min">
                {items.map((name) => (
                    <div key={name} className="bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-6 flex items-center justify-center h-28">
                        <span className="text-white/40 font-semibold text-sm">{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
