export default function PatternLoadingPage() {
    return (
        <div className="h-full flex flex-col animate-fade-in">
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    Pattern: Loading
                </h1>
                <p className="text-white/40 font-medium">
                    Placeholder content for a loading state page.
                </p>
            </header>
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
                    <p className="text-white/30 text-sm font-medium">Loading ...</p>
                </div>
            </div>
        </div>
    );
}
