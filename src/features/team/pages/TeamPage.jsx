import React, { useState, useMemo } from "react";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Mail,
    Shield,
    Trash2,
    Edit2,
    CheckCircle,
    X
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Form from "@/components/Form";

const ROLES = ["Owner", "Admin", "Member", "Viewer"];
const STATUSES = ["Active", "Inactive", "Pending"];

const TEAM_FIELDS = [
    {
        key: "name",
        type: "text",
        label: "Full Name",
        placeholder: "e.g. Jane Doe",
        required: true,
        col: "left",
    },
    {
        key: "email",
        type: "email",
        label: "Work Email",
        placeholder: "e.g. jane@meet.ai",
        required: true,
        col: "left",
    },
    {
        key: "role",
        type: "dropdown",
        label: "Role",
        required: true,
        options: ROLES,
        col: "left",
    },
    {
        key: "status",
        type: "dropdown",
        label: "Status",
        required: true,
        options: STATUSES,
        col: "left",
    },
    {
        key: "bio",
        type: "textarea",
        label: "Bio",
        placeholder: "Brief description of their role or expertise...",
        rows: 3,
        col: "right",
    },
];

export default function TeamPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [members, setMembers] = useState([
        { id: 1, name: "Aria Sterling", email: "aria@meet.ai", role: "Owner", status: "Active", bio: "Lead Neuro-Architect" },
        { id: 2, name: "Marcus Thorne", email: "marcus@meet.ai", role: "Admin", status: "Active", bio: "Core Platform Engineer" },
        { id: 3, name: "Elena Vane", email: "elena@meet.ai", role: "Member", status: "Inactive", bio: "UI Strategy Lead" },
        { id: 4, name: "Cyrus Frost", email: "cyrus@meet.ai", role: "Member", status: "Pending", bio: "Data Scientist" },
    ]);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [openActionMenuId, setOpenActionMenuId] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);


    const filteredMembers = useMemo(() => {
        return members.filter(m =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [members, searchTerm]);

    const openCreateModal = () => {
        setModalMode("create");
        setFormValues({ role: "Member", status: "Active" });
        setServerErrors({});
        setModalOpen(true);
    };

    const openEditModal = (member) => {
        setModalMode("edit");
        setEditingMemberId(member.id);
        setFormValues({ ...member });
        setServerErrors({});
        setModalOpen(true);
        setOpenActionMenuId(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this team member?")) {
            setMembers(prev => prev.filter(m => m.id !== id));
            setOpenActionMenuId(null);
        }
    };

    const handleSubmit = (data) => {
        if (modalMode === "create") {
            const newMember = {
                ...data,
                id: Math.max(...members.map(m => m.id)) + 1,
            };
            setMembers(prev => [newMember, ...prev]);
        } else {
            setMembers(prev => prev.map(m => m.id === editingMemberId ? { ...m, ...data } : m));
        }
        setModalOpen(false);
    };

    const handleChange = (key, val) => setFormValues(prev => ({ ...prev, [key]: val }));

    return (
        <div className="h-full flex gap-8 animate-fade-in relative overflow-hidden">
            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedMember ? 'pr-[420px]' : ''}`}>
                <header className="mb-8 flex justify-between items-end shrink-0">

                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                            Team Management
                        </h1>
                        <p className="text-white/40 font-medium">
                            Coordinate your collective intelligence.
                        </p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus size={14} /> Enroll Unit
                    </Button>
                </header>

                {/* Controls */}
                <div className="flex gap-4 mb-6 shrink-0">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search team members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.08] transition-all"
                        />
                    </div>
                    <button className="px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/[0.08] transition-all">
                        <Filter size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Filter</span>
                    </button>
                </div>

                {/* Team Table */}
                <div className="bg-white/[0.03] border border-white/[0.1] rounded-[30px] overflow-hidden flex-1 flex flex-col p-1">
                    <div className="overflow-x-auto rounded-[26px] h-full no-scrollbar">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/[0.08] sticky top-0 bg-[#0A0A0A] z-10">
                                <tr>
                                    <th className="px-6 py-5">Unit / Member</th>
                                    <th className="px-6 py-5">Role</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5 text-right font-black">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {filteredMembers.map((member) => (
                                    <tr
                                        key={member.id}
                                        onClick={() => setSelectedMember(member)}
                                        className={`hover:bg-white/[0.06] transition-colors group relative cursor-pointer ${selectedMember?.id === member.id ? 'bg-white/[0.08]' : ''}`}
                                    >
                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-sm font-bold text-white group-hover:scale-105 transition-transform duration-300">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white tracking-tight">{member.name}</div>
                                                    <div className="text-xs text-white/40 font-medium">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className="text-white/20" />
                                                <span className="text-white/70 font-bold text-xs uppercase tracking-widest">{member.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant={member.status === 'Active' ? 'success' : member.status === 'Pending' ? 'high' : 'default'}>
                                                {member.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 shrink-0">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openEditModal(member); }}
                                                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                    title="Edit Member"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(member.id); }}
                                                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Remove Member"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredMembers.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-white/20 font-bold uppercase tracking-widest text-xs">
                                <Users size={48} className="mb-4 opacity-20" />
                                No matches in your database
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Slide-over Profile Panel */}
            <div className={`fixed top-0 right-0 h-full w-[400px] bg-[#050505] border-l border-white/[0.1] p-8 shadow-2xl transition-transform duration-500 z-50 flex flex-col ${selectedMember ? 'translate-x-0' : 'translate-x-[110%]'}`}>
                {selectedMember && (
                    <>
                        <div className="flex items-center justify-between mb-8 text-white">
                            <h2 className="text-lg font-black tracking-tight">Unit Configuration</h2>
                            <button onClick={() => setSelectedMember(null)} className="p-2 bg-white/[0.05] rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors border border-white/10">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 rounded-2xl bg-white/[0.1] mb-4 flex items-center justify-center text-2xl font-black text-white border border-white/10 shadow-lg">
                                {selectedMember.name.charAt(0)}
                            </div>
                            <h3 className="text-xl font-black text-white tracking-tight">{selectedMember.name}</h3>
                            <p className="text-sm text-white/50 font-bold mt-1 uppercase tracking-widest text-[10px]">{selectedMember.role}</p>
                        </div>

                        <div className="flex gap-3 mb-8">
                            <Button variant="secondary" className="flex-1 py-3 text-white/70 hover:text-white">
                                <Mail size={14} /> Send Message
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 py-3"
                                onClick={() => openEditModal(selectedMember)}
                            >
                                <Edit2 size={14} /> Reconfig
                            </Button>
                        </div>

                        <div className="flex-1 space-y-8 overflow-y-auto pr-2 no-scrollbar">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Unit Parameters</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                                        <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Email</span>
                                        <span className="text-sm font-medium text-white/80">{selectedMember.email}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                                        <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Status</span>
                                        <Badge variant={selectedMember.status === 'Active' ? 'success' : 'high'}>{selectedMember.status}</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">System Bio</h4>
                                <Card className="p-5">
                                    <p className="text-sm text-white/60 leading-relaxed italic">
                                        "{selectedMember.bio || "No biography data found in central memory."}"
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalMode === "create" ? "Enroll New Unit" : "Update Member Config"}
                description={modalMode === "create" ? "Initialize a new member into the Operational Team." : "Modify the parameters for this existing unit."}
                size="lg"
            >
                <Form
                    fields={TEAM_FIELDS}
                    values={formValues}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    errors={serverErrors}
                    submitLabel={modalMode === "create" ? "Enroll Unit" : "Apply Updates"}
                />
            </Modal>
        </div>
    );
}
