import React, { useState } from "react";
import { Search, Filter, MoreVertical, X, Phone, Mail, MapPin } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

export default function ContactsPage() {
    const [selectedContact, setSelectedContact] = useState(null);

    const contacts = [
        { id: 1, name: "Alice Freeman", company: "Cyberdyne Systems", role: "CTO", status: "Active", email: "alice@cyberdyne.com" },
        { id: 2, name: "Bob Smith", company: "Aperture Science", role: "Lead Engineer", status: "Inactive", email: "bob@aperture.com" },
        { id: 3, name: "Charlie Davis", company: "Stark Industries", role: "Procurement", status: "Active", email: "charlie@stark.com" },
        { id: 4, name: "Diana Prince", company: "Wayne Enterprises", role: "Director", status: "Lead", email: "diana@wayne.com" },
        { id: 5, name: "Evan Wright", company: "Massive Dynamic", role: "CEO", status: "Active", email: "evan@md.com" },
    ];

    return (
        <div className="h-full flex gap-8 animate-fade-in relative overflow-hidden">
            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedContact ? 'pr-[420px]' : ''}`}>
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                            Contacts & Leads
                        </h1>
                        <p className="text-white/40 font-medium">
                            Manage your ecosystem of clients and prospects.
                        </p>
                    </div>
                    <Button onClick={() => { }}>
                        + New Contact
                    </Button>
                </header>

                {/* Controls */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.08] transition-all"
                        />
                    </div>
                    <button className="px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/[0.08] transition-all">
                        <Filter size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Filter</span>
                    </button>
                </div>

                {/* Data Table - Styled like Pipeline Column Container */}
                <div className="bg-white/[0.03] border border-white/[0.1] rounded-[30px] overflow-hidden flex-1 flex flex-col p-1">
                    <div className="overflow-x-auto rounded-[26px]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/[0.08]">
                                <tr>
                                    <th className="px-6 py-5">Name</th>
                                    <th className="px-6 py-5">Company</th>
                                    <th className="px-6 py-5">Role</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {contacts.map((contact) => (
                                    <tr
                                        key={contact.id}
                                        onClick={() => setSelectedContact(contact)}
                                        className="hover:bg-white/[0.06] transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-white/[0.1] flex items-center justify-center text-xs font-bold text-white border border-white/10 group-hover:scale-105 transition-transform">
                                                    {contact.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-white">{contact.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-white/60 font-medium">{contact.company}</td>
                                        <td className="px-6 py-5 text-white/60 font-medium">{contact.role}</td>
                                        <td className="px-6 py-5">
                                            {/* Using Pipeline Tag Style */}
                                            <Badge variant={contact.status === 'Active' ? 'success' : contact.status === 'Lead' ? 'medium' : 'default'}>
                                                {contact.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-white/30 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Slide-over Profile Panel - Styled like a Pipeline Card */}
            <div className={`fixed top-0 right-0 h-full w-[400px] bg-[#050505] border-l border-white/[0.1] p-8 shadow-2xl transition-transform duration-500 z-50 flex flex-col ${selectedContact ? 'translate-x-0' : 'translate-x-[110%]'}`}>
                {selectedContact && (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-black text-white tracking-tight">Profile Overview</h2>
                            <button onClick={() => setSelectedContact(null)} className="p-2 bg-white/[0.05] rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors border border-white/10">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 rounded-2xl bg-white/[0.1] mb-4 flex items-center justify-center text-2xl font-black text-white border border-white/10 shadow-lg">
                                {selectedContact.name.charAt(0)}
                            </div>
                            <h3 className="text-xl font-black text-white tracking-tight">{selectedContact.name}</h3>
                            <p className="text-sm text-white/50 font-bold mt-1">{selectedContact.role} at {selectedContact.company}</p>
                        </div>

                        <div className="flex gap-3 mb-8">
                            <Button variant="secondary" className="flex-1 py-3 text-white/70 hover:text-white">
                                <Mail size={14} /> Email
                            </Button>
                            <Button variant="primary" className="flex-1 py-3">
                                <Phone size={14} /> Call
                            </Button>
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Details</h4>
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center gap-3 text-white/60">
                                        <Mail size={16} className="text-white/40" />
                                        <span>{selectedContact.email}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-white/60">
                                        <MapPin size={16} className="text-white/40 mt-0.5" />
                                        <span>San Francisco, CA<br />United States</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Card - Exact Pipeline Deal Card Style */}
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Timeline Notes</h4>
                                <Card className="p-5">
                                    <div className="relative z-10">
                                        <p className="text-sm text-white/80 mb-3 leading-relaxed">
                                            Sent introductory email with Q3 overview.
                                        </p>
                                        <p className="text-[10px] uppercase font-bold text-white/40">
                                            2 days ago by You
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}