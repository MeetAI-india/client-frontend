import React from "react";
import { Settings, Shield, Bell, Key, Zap } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function SettingsPage() {
    const sections = [
        { id: 'account', label: 'Account Profile', icon: Zap, desc: 'Manage your personal identity.' },
        { id: 'security', label: 'Security & Auth', icon: Shield, desc: 'Passwords, 2FA and sessions.' },
        { id: 'notifs', label: 'Notifications', icon: Bell, desc: 'Manage alerts and emails.' },
        { id: 'api', label: 'API Access', icon: Key, desc: 'Developer tools and tokens.' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    Settings
                </h1>
                <p className="text-white/40 font-medium">
                    Fine-tune the platform to match your workflow requirements.
                </p>
            </header>

            <div className="flex flex-col gap-2">
                {sections.map((s) => (
                    <Card
                        key={s.id}
                        className="p-4"
                        onClick={() => { }}
                    >
                        <div className="relative z-10 flex items-center gap-5">
                            <div className="w-9 h-9 bg-white/[0.08] border border-white/10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <s.icon size={15} className="text-white/80" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-white mb-0.5 leading-tight">{s.label}</h3>
                                <p className="text-xs text-white/40">{s.desc}</p>
                            </div>
                            <div className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all flex-shrink-0">
                                <Zap size={14} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Danger Zone - Styled with Red Tinted Pipeline Card Style */}
            <div className="mt-8">
                <Card className="bg-red-500/10 border-red-500/20 p-5 hover:bg-red-500/15">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-red-400 font-bold mb-1">Danger Zone</h4>
                            <p className="text-[10px] text-red-400/50 uppercase tracking-widest font-black">
                                This action is irreversible
                            </p>
                        </div>
                        <button className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 text-[11px] font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">
                            Delete Account
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}