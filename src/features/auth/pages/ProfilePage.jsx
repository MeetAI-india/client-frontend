import { User, Mail, Shield, Calendar } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function ProfilePage() {
    return (
        <div className="space-y-8 animate-fade-in max-w-2xl">
            <header className="mb-8">
                <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                    Profile
                </h1>
                <p className="text-white/40 font-medium">
                    Manage your personal identity and account details.
                </p>
            </header>

            <Card className="p-6">
                <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center">
                        <User size={28} className="text-white/60" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg">Alice F.</h2>
                        <p className="text-white/40 text-sm">alice@example.com</p>
                    </div>
                    <Button className="ml-auto" onClick={() => {}}>Edit</Button>
                </div>

                <div className="space-y-6">
                    {[
                        { icon: User, label: "Full Name", value: "Alice F." },
                        { icon: Mail, label: "Email", value: "alice@example.com" },
                        { icon: Shield, label: "Role", value: "Maintainer" },
                        { icon: Calendar, label: "Member Since", value: "Jan 2026" },
                    ].map((f) => (
                        <div key={f.label} className="flex items-center gap-4 pb-4 border-b border-white/[0.06] last:border-0 last:pb-0">
                            <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                                <f.icon size={15} className="text-white/50" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-white/30 font-semibold uppercase tracking-widest">{f.label}</p>
                                <p className="text-white font-bold mt-0.5">{f.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
