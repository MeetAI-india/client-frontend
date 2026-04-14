import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    ArrowLeft, Users, Calendar, Info, CheckCircle,
    Briefcase, Plus, Edit, MoreVertical, Mail,
    CheckCircle2, Circle, ListTodo, RotateCcw, AlertTriangle, UserMinus, Shield, X
} from "lucide-react";

import Card from "@/components/Card";
import Button from "@/components/Button";
import TabBar from "@/components/TabBar";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Form from "@/components/Form";
import {
    getProject, updateProject, reactivateProject,
    getProjectMembers, addProjectMember, removeProjectMember, changeMemberRole,
    searchUsers
} from "../api/projects";
import { PROJECT_FIELDS, formatStatusLabel, formatRoleLabel, MEMBER_ROLE_OPTIONS } from "../constants";

// ── Helpers ─────────────────────────────────────────────────────────────────

const CAN_EDIT = ["owner", "admin", "maintainer"];
const CAN_MANAGE_MEMBERS = ["owner", "admin", "maintainer"];

// ── Small helper component to keep the detail rows DRY ─────────────────────

function DetailRow({ label, children }) {
    return (
        <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
            <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest shrink-0 mr-4">
                {label}
            </span>
            <div className="text-right">{children}</div>
        </div>
    );
}

// ── Custom Scrollbar Styles ─────────────────────────────────────────────────
const SCROLLBAR_STYLE = (
    <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 6px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 99px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.15); }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.08) transparent; }
    `}</style>
);

// ── Page ────────────────────────────────────────────────────────────────────

export default function ProjectDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const memberActionRef = useRef(null);

    // Auth
    const isSuperAdmin = useSelector((state) => state.auth.user?.is_super_admin === true);
    const currentUserId = useSelector((state) => state.auth.user?.id);

    // Role passed from list page via router state
    const userRole = location.state?.user_role;
    const canEdit = isSuperAdmin || CAN_EDIT.includes(userRole);
    const canManageMembers = isSuperAdmin || CAN_MANAGE_MEMBERS.includes(userRole);

    // State
    const [activeTab, setActiveTab] = useState("Info");
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal / form (Project Update)
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [serverErrors, setServerErrors] = useState({});

    // Reactivate
    const [reactivating, setReactivating] = useState(false);

    // Members State
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [membersError, setMembersError] = useState("");

    // Add Member Modal
    const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [addMemberForm, setAddMemberForm] = useState({ user_id: "", role: "member" });
    const [addMemberLoading, setAddMemberLoading] = useState(false);
    const [addMemberError, setAddMemberError] = useState("");

    // User Search State
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [userSearchLoading, setUserSearchLoading] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Change Role Modal
    const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
    const [changingUserId, setChangingUserId] = useState(null);
    const [changeRoleForm, setChangeRoleForm] = useState({ role: "member" });
    const [changeRoleLoading, setChangeRoleLoading] = useState(false);
    const [changeRoleError, setChangeRoleError] = useState("");

    // Member Action Menu
    const [openMemberActionId, setOpenMemberActionId] = useState(null);

    // ── Slide-over panel state ──────────────────────────────────────────
    const [selectedMember, setSelectedMember] = useState(null);

    // ── Static placeholder data ─────────────────────────────────────────

    const tasks = [
        { id: 1, title: "Finalize color palette", priority: "High", completed: false, due: "Today" },
        { id: 2, title: "Review API integration", priority: "Medium", completed: true, due: "Completed" },
        { id: 3, title: "Update wireframes", priority: "Low", completed: false, due: "Tomorrow" },
    ];

    const tabs = [
        { id: "Info", label: "Project Info", icon: Info },
        { id: "Team", label: "Team Members", icon: Users },
        { id: "Tasks", label: "Tasks", icon: ListTodo },
        { id: "Meetings", label: "Meetings", icon: Calendar },
    ];

    // ── Load project ───────────────────────────────────────────────────

    useEffect(() => {
        let mounted = true;

        async function loadProject() {
            if (!id) {
                if (mounted) {
                    setError("Project id is missing.");
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response = await getProject(id);
                if (!mounted) return;
                setProject(response?.data ?? response);
            } catch (fetchError) {
                if (!mounted) return;
                setError(fetchError.message || "Failed to load project.");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadProject();
        return () => { mounted = false; };
    }, [id]);

    // ── Load members (lazy when clicking Team tab) ─────────────────────

    useEffect(() => {
        const isSelected = activeTab === "Team";
        if (!isSelected || members.length > 0) return;

        let mounted = true;

        async function loadMembers() {
            setMembersLoading(true);
            setMembersError("");
            try {
                const response = await getProjectMembers(id);
                if (!mounted) return;
                setMembers(Array.isArray(response?.data) ? response.data : []);
            } catch (err) {
                if (!mounted) return;
                setMembersError(err.message || "Failed to load members");
            } finally {
                if (mounted) setMembersLoading(false);
            }
        }

        loadMembers();
        return () => { mounted = false; };
    }, [activeTab, id, members.length]);

    // ── Close action menus on outside click ────────────────────────────

    useEffect(() => {
        if (!openMemberActionId) return;

        const handleOutsideClick = (event) => {
            if (!memberActionRef.current?.contains(event.target)) {
                setOpenMemberActionId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [openMemberActionId]);

    // ── Debounced User Search ──────────────────────────────────────────
    useEffect(() => {
        if (!userSearchQuery.trim() || selectedUser) {
            setUserSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setUserSearchLoading(true);
            try {
                const res = await searchUsers(userSearchQuery);
                const users = res?.data?.users || [];

                // Filter out users who are already active members in this project
                const existingMemberIds = new Set(members.map((m) => m.user_id));
                setUserSearchResults(users.filter((u) => !existingMemberIds.has(u.id)));
            } catch (err) {
                console.error("User search failed:", err);
            } finally {
                setUserSearchLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [userSearchQuery, selectedUser, members]);

    // ── Close sidebar on Escape ─────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && selectedMember) {
                setSelectedMember(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [selectedMember]);

    // ── Modal helpers (Project) ────────────────────────────────────────

    const openEditModal = () => {
        if (!project) return;
        setFormValues({
            name: project.name ?? "",
            status: project.status ?? "not_started",
            short_description: project.short_description ?? "",
            deadline: project.deadline ?? "",
            description: project.description ?? "",
        });
        setServerErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        if (!formLoading) setModalOpen(false);
    };

    const handleChange = (key, val) =>
        setFormValues((prev) => ({ ...prev, [key]: val }));

    const handleSubmit = async (data) => {
        setFormLoading(true);
        setServerErrors({});
        try {
            const payload = {
                name: data.name,
                short_description: data.short_description?.trim() || null,
                deadline: data.deadline || null,
                description: data.description?.trim() || null,
                status: data.status,
            };

            const updated = await updateProject(id, payload);
            const newProject = updated?.data ?? updated;
            setProject(newProject);
            setModalOpen(false);
        } catch (e) {
            setServerErrors({ name: e.message });
        } finally {
            setFormLoading(false);
        }
    };

    // ── Reactivate (super admin) ────────────────────────────────────────

    const handleReactivate = async () => {
        if (!project) return;
        const confirmed = window.confirm(`Reactivate "${project.name}"?`);
        if (!confirmed) return;

        setReactivating(true);
        try {
            const response = await reactivateProject(project.id);
            const reactivated = response?.data ?? response;
            setProject(reactivated);
        } catch (e) {
            setError(e.message || "Failed to reactivate project.");
        } finally {
            setReactivating(false);
        }
    };

    // ── Member Handlers ────────────────────────────────────────────────

    const openAddMemberModal = () => {
        setAddMemberForm({ user_id: "", role: "member" });
        setAddMemberError("");
        setSelectedUser(null);
        setUserSearchQuery("");
        setUserSearchResults([]);
        setShowUserDropdown(false);
        setAddMemberModalOpen(true);
    };

    const handleAddMember = async () => {
        if (!addMemberForm.user_id.trim()) return;

        setAddMemberLoading(true);
        setAddMemberError("");
        try {
            const res = await addProjectMember(id, addMemberForm);
            const newMember = res?.data;
            setMembers((prev) => [...prev, newMember].sort((a, b) => new Date(a.joined_at) - new Date(b.joined_at)));
            setAddMemberModalOpen(false);
        } catch (e) {
            setAddMemberError(e.message || "Failed to add member.");
        } finally {
            setAddMemberLoading(false);
        }
    };

    const handleRemoveMember = async (member) => {
        const confirmed = window.confirm(`Remove "${member.user_name}" from this project?`);
        if (!confirmed) return;

        try {
            await removeProjectMember(id, member.user_id);
            setMembers((prev) => prev.filter((m) => m.user_id !== member.user_id));
            setOpenMemberActionId(null);
            if (selectedMember?.user_id === member.user_id) setSelectedMember(null); // close sidebar if removed
        } catch (e) {
            setMembersError(e.message || "Failed to remove member.");
        }
    };

    const openChangeRoleModal = (member) => {
        setChangingUserId(member.user_id);
        setChangeRoleForm({ role: member.role });
        setChangeRoleError("");
        setChangeRoleModalOpen(true);
        setOpenMemberActionId(null);
    };

    const handleChangeRole = async () => {
        setChangeRoleLoading(true);
        setChangeRoleError("");
        try {
            const res = await changeMemberRole(id, changingUserId, changeRoleForm);
            const updatedMember = res?.data;
            setMembers((prev) => prev.map((m) => (m.user_id === changingUserId ? updatedMember : m)));

            // Optimistic update for sidebar if viewing this user
            if (selectedMember?.user_id === changingUserId) {
                setSelectedMember((prev) => ({ ...prev, role: updatedMember.role }));
            }

            setChangeRoleModalOpen(false);
        } catch (e) {
            setChangeRoleError(e.message || "Failed to change role.");
        } finally {
            setChangeRoleLoading(false);
        }
    };

    // ── Derived ─────────────────────────────────────────────────────────

    const uiStatus = useMemo(() => formatStatusLabel(project?.status), [project?.status]);

    const formattedDeadline = useMemo(() => {
        if (!project?.deadline) return "No deadline set";
        const parsed = new Date(project.deadline);
        if (Number.isNaN(parsed.getTime())) return project.deadline;
        return parsed.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }, [project?.deadline]);

    const isDeleted = project && !project.is_active;

    // ── Render ──────────────────────────────────────────────────────────

    return (
        <>
            {SCROLLBAR_STYLE}

            {/* ── Main Content (Handles scrolling internally) ── */}
            <div className="h-full flex flex-col animate-fade-in">

                {/* ── Deleted Project Banner (Super Admin) ── */}
                {isDeleted && isSuperAdmin && (
                    <div className="mb-6 flex items-center gap-4 p-4 bg-red-500/[0.08] border border-red-500/20 rounded-2xl animate-fade-in">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={20} className="text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-red-300">This project has been soft-deleted.</p>
                            <p className="text-xs text-red-400/70 mt-0.5">
                                It is no longer visible to regular users. You can restore it.
                            </p>
                        </div>
                        <Button onClick={handleReactivate} disabled={reactivating} variant="secondary">
                            <RotateCcw size={14} className={reactivating ? "animate-spin" : ""} />
                            {reactivating ? "Restoring..." : "Reactivate"}
                        </Button>
                    </div>
                )}

                <header className="mb-8 flex-shrink-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} /> Back to Projects
                    </button>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                                {loading ? "Loading project..." : project?.name ?? "Project"}
                            </h1>
                            <p className="text-white/40 font-medium max-w-xl">
                                {error || project?.short_description || project?.description || "No project summary available yet."}
                            </p>
                        </div>
                        {!isDeleted && (
                            <div className="flex items-center gap-3">
                                {activeTab === "Team" ? (
                                    canManageMembers && (
                                        <Button onClick={openAddMemberModal} disabled={loading}>
                                            <Plus size={14} /> Add Member
                                        </Button>
                                    )
                                ) : (
                                    canEdit && (
                                        <Button onClick={openEditModal} disabled={loading}>
                                            <Edit size={14} /> Edit Project
                                        </Button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </header>

                <div className="mb-6 flex-shrink-0">
                    <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-5 transition-colors overflow-y-auto min-h-0">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-white/40 font-bold">
                            Loading project details...
                        </div>
                    ) : error ? (
                        <div className="h-full flex items-center justify-center text-red-400 font-bold">
                            {error}
                        </div>
                    ) : (
                        <>

                            {activeTab === "Info" && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full auto-rows-fr">
                                    <Card className="flex flex-col p-6 h-full">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-white text-lg tracking-tight">Dashboard Overview</h3>
                                            <Briefcase size={20} className="text-white/40" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-center space-y-6">
                                            <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                                                <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Status</span>
                                                <span className="text-lg font-black text-white">{uiStatus}</span>
                                            </div>
                                            <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                                                <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Project ID</span>
                                                <span className="text-sm font-black text-white break-all text-right">{project?.id}</span>
                                            </div>
                                            <div className="flex justify-between items-baseline border-b border-white/5 pb-4">
                                                <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Deadline</span>
                                                <span className="text-lg font-black text-white text-right">{formattedDeadline}</span>
                                            </div>
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Availability</span>
                                                <span className="text-lg font-black text-white">
                                                    {project?.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="flex flex-col p-6 h-full">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-white text-lg tracking-tight">Project Details</h3>
                                            <CheckCircle size={20} className="text-green-400" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-start space-y-6">
                                            <div className="space-y-2 border-b border-white/5 pb-4">
                                                <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Short Description</span>
                                                <p className="text-sm text-white/80 leading-relaxed">
                                                    {project?.short_description || "No short description available yet."}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Description</span>
                                                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                                                    {project?.description || "No detailed description available yet."}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {activeTab === "Team" && (
                                <div className="h-full flex flex-col gap-4">
                                    {membersError && (
                                        <div className="text-center py-4 bg-red-500/[0.05] border border-red-500/20 rounded-2xl">
                                            <p className="text-red-400 font-bold text-sm">{membersError}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/10 pb-3 px-2">
                                        <div className="w-8"></div>
                                        <div className="flex-1">Member</div>
                                        <div className="w-32 hidden md:block">Role</div>
                                        <div className="w-24 hidden md:block">Status</div>
                                        <div className="w-28 text-right">Actions</div>
                                    </div>

                                    {membersLoading ? (
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-white/40 font-bold animate-pulse">Loading team...</p>
                                        </div>
                                    ) : (
                                        <>
                                            {members.map((member) => (
                                                <Card
                                                    key={member.id}
                                                    className={`flex items-center p-4 gap-4 hover:-translate-y-0.5 transition-all cursor-pointer ${selectedMember?.user_id === member.user_id ? "bg-white/[0.06] border-white/20" : ""
                                                        }`}
                                                    onClick={() => setSelectedMember(member)}
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold text-white border border-white/10 flex-shrink-0">
                                                        {member.user_name.charAt(0)}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-white truncate flex items-center gap-2">
                                                            {member.user_name}
                                                            {member.user_id === currentUserId && (
                                                                <span className="text-[9px] font-bold text-white/30 border border-white/10 px-1.5 py-0.5 rounded-md uppercase">You</span>
                                                            )}
                                                        </h4>
                                                        <p className="text-xs text-white/40 truncate">{member.user_email}</p>
                                                    </div>

                                                    <div className="w-32 hidden md:block">
                                                        <span className="text-xs text-white/60 font-medium">{formatRoleLabel(member.role)}</span>
                                                    </div>

                                                    <div className="w-24 hidden md:flex items-center">
                                                        <Badge variant={member.is_active ? "success" : "high"}>
                                                            {member.is_active ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </div>

                                                    <div className="w-28 flex items-center justify-end gap-1 flex-shrink-0">
                                                        <button
                                                            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Mail size={16} />
                                                        </button>

                                                        {canManageMembers && member.user_id !== currentUserId && member.role !== "owner" && (
                                                            <div className="relative" ref={openMemberActionId === member.user_id ? memberActionRef : null}>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenMemberActionId((curr) => (curr === member.user_id ? null : member.user_id));
                                                                    }}
                                                                    className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                                                >
                                                                    <MoreVertical size={16} />
                                                                </button>

                                                                {openMemberActionId === member.user_id && (
                                                                    <div className="absolute right-0 top-12 z-20 min-w-[140px] overflow-hidden rounded-xl border border-white/10 bg-[#161616] shadow-2xl">
                                                                        <button
                                                                            onClick={() => openChangeRoleModal(member)}
                                                                            className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:bg-white/5 hover:text-white flex items-center gap-2"
                                                                        >
                                                                            <Shield size={14} /> Change Role
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleRemoveMember(member)}
                                                                            className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 flex items-center gap-2"
                                                                        >
                                                                            <UserMinus size={14} /> Remove
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card>
                                            ))}

                                            {canManageMembers && (
                                                <button
                                                    onClick={openAddMemberModal}
                                                    className="w-full mt-2 py-3 border border-dashed border-white/20 rounded-2xl text-white/40 text-xs font-bold uppercase tracking-widest hover:bg-white/[0.05] hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={14} /> Add Team Member
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {activeTab === "Tasks" && (
                                <div className="h-full flex flex-col gap-4">
                                    <div className="flex items-center justify-between mb-2 px-2">
                                        <h3 className="font-bold text-white text-lg tracking-tight">Active Tasks</h3>
                                        <Button variant="secondary"><Plus size={12} /> Add Task</Button>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {tasks.map((task) => (
                                            <Card
                                                key={task.id}
                                                className={`p-5 transition-all ${task.completed ? "opacity-40 hover:opacity-60" : "hover:-translate-y-0.5"}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <button className="text-white/40 hover:text-white transition-colors mt-0.5 flex-shrink-0">
                                                        {task.completed
                                                            ? <CheckCircle2 size={22} className="text-green-400" />
                                                            : <Circle size={22} />}
                                                    </button>

                                                    <div className="flex-1 min-w-0">
                                                        <p className={`font-bold text-white mb-1 transition-all ${task.completed ? "line-through text-white/60" : ""}`}>
                                                            {task.title}
                                                        </p>
                                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                                                            {task.due}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        <Badge variant={task.priority.toLowerCase()}>
                                                            {task.priority}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "Meetings" && (
                                <div className="h-full flex flex-col gap-4">
                                    {["Sprint Planning", "Design Review", "Client Sync"].map((meet, i) => (
                                        <Card key={i} className="flex items-center p-5 gap-5 hover:-translate-y-0.5 cursor-pointer">
                                            <div className="w-10 h-10 bg-white/[0.08] border border-white/10 rounded-xl flex items-center justify-center text-white/80">
                                                <Calendar size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white">{meet}</h4>
                                                <p className="text-xs text-white/50">Oct 2{i + 4}, 2024</p>
                                            </div>
                                            <Badge>Upcoming</Badge>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                Sidebar + Backdrop — Rendered at root level to prevent clipping
            ══════════════════════════════════════════════════════════════ */}

            {/* ── Backdrop ── */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${selectedMember ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setSelectedMember(null)}
                aria-hidden="true"
            />

            {/* ── Slide-over Profile Panel ── */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#050505] border-l border-white/[0.1] shadow-2xl transition-transform duration-500 ease-out z-50 flex flex-col ${selectedMember ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {selectedMember && (
                    <>
                        {/* ── Header (pinned) ── */}
                        <div className="flex items-center justify-between px-8 py-6 shrink-0 border-b border-white/[0.06]">
                            <h2 className="text-lg font-black tracking-tight text-white">
                                Member Profile
                            </h2>
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="p-2 bg-white/[0.05] rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* ── Scrollable Content ── */}
                        <div className="flex-1 overflow-y-auto sidebar-scroll px-8 py-8 min-h-0">
                            {/* Avatar + Name */}
                            <div className="flex flex-col items-center mb-10">
                                <div className="w-20 h-20 rounded-2xl bg-white/[0.1] mb-4 flex items-center justify-center text-2xl font-black text-white border border-white/10 shadow-lg">
                                    {selectedMember.user_name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight">
                                    {selectedMember.user_name}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant={selectedMember.is_active ? "success" : "high"}>
                                        {selectedMember.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                    {selectedMember.user_id === currentUserId && (
                                        <span className="text-[9px] font-bold text-white/30 border border-white/10 px-1.5 py-0.5 rounded-md uppercase">You</span>
                                    )}
                                </div>
                                <p className="text-[10px] text-white/50 font-bold mt-1.5 uppercase tracking-widest">
                                    {formatRoleLabel(selectedMember.role)}
                                </p>
                            </div>

                            {/* Member Details */}
                            <div className="space-y-5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                    Member Details
                                </h4>

                                <DetailRow label="Email">
                                    <span className="text-sm font-medium text-white/80 break-all">
                                        {selectedMember.user_email}
                                    </span>
                                </DetailRow>

                                <DetailRow label="Project Role">
                                    <div className="flex items-center gap-1.5">
                                        <Shield size={14} className="text-white/30" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                                            {formatRoleLabel(selectedMember.role)}
                                        </span>
                                    </div>
                                </DetailRow>

                                <DetailRow label="Status">
                                    <Badge variant={selectedMember.is_active ? "success" : "high"}>
                                        {selectedMember.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </DetailRow>

                                <DetailRow label="Joined">
                                    <span className="text-xs font-medium text-white/50">
                                        {selectedMember.joined_at
                                            ? new Date(selectedMember.joined_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "Unknown"}
                                    </span>
                                </DetailRow>
                            </div>

                            {/* System Reference */}
                            <div className="mt-10 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                    System Reference
                                </h4>
                                <Card className="p-4">
                                    <code className="text-xs text-white/30 font-mono break-all">
                                        {selectedMember.user_id}
                                    </code>
                                </Card>
                            </div>
                        </div>

                        {/* ── Footer (pinned) ── */}
                        <div className="px-8 py-6 border-t border-white/[0.06] shrink-0 bg-[#050505] flex flex-col gap-3">
                            <Button
                                variant="secondary"
                                className="w-full py-3 text-white/70 hover:text-white flex items-center justify-center gap-2"
                                onClick={() => window.open(`mailto:${selectedMember.user_email}`, "_blank")}
                            >
                                <Mail size={14} /> Send Email
                            </Button>

                            {canManageMembers && selectedMember.user_id !== currentUserId && selectedMember.role !== "owner" && (
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="secondary"
                                        className="w-full py-3 text-white/70 hover:text-white flex items-center justify-center gap-2"
                                        onClick={() => openChangeRoleModal(selectedMember)}
                                    >
                                        <Shield size={14} /> Change Role
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="w-full py-3 text-red-400/70 hover:text-red-300 flex items-center justify-center gap-2 hover:bg-red-500/10"
                                        onClick={() => handleRemoveMember(selectedMember)}
                                    >
                                        <UserMinus size={14} /> Remove
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* ── Modals (Extracted to root to prevent z-index/clipping issues) ── */}

            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title="Update Project"
                description="Update the project details below."
                size="lg"
            >
                <Form
                    fields={PROJECT_FIELDS}
                    values={formValues}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    errors={serverErrors}
                    submitLabel="Update Project"
                    loading={formLoading}
                />
            </Modal>

            <Modal
                isOpen={addMemberModalOpen}
                onClose={() => !addMemberLoading && setAddMemberModalOpen(false)}
                title="Add Team Member"
                description="Search for a user by name or email, then assign a role."
                size="sm"
            >
                <div className="space-y-4">
                    {/* User Search Input */}
                    <div className="relative">
                        <label className="text-xs uppercase font-bold text-white/40 tracking-widest block mb-2">
                            Select User
                        </label>

                        {selectedUser ? (
                            /* Display Selected User */
                            <div className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between">
                                <div className="min-w-0">
                                    <span className="font-bold block truncate">{selectedUser.full_name}</span>
                                    <span className="text-white/40 text-xs truncate block">{selectedUser.email}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setAddMemberForm((p) => ({ ...p, user_id: "" }));
                                        setUserSearchQuery("");
                                    }}
                                    className="text-white/40 hover:text-white ml-2 flex-shrink-0"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            /* Search Input & Dropdown */
                            <>
                                <input
                                    type="text"
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                    onFocus={() => setShowUserDropdown(true)}
                                    placeholder="Type name or email..."
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                />

                                {showUserDropdown && (
                                    <>
                                        {/* Invisible backdrop to close dropdown */}
                                        <div className="fixed inset-0 z-20" onClick={() => setShowUserDropdown(false)} />

                                        {/* Dropdown List */}
                                        <div className="absolute z-30 w-full mt-2 max-h-60 overflow-y-auto bg-[#161616] border border-white/10 rounded-xl shadow-2xl">
                                            {userSearchLoading && (
                                                <div className="p-4 text-center text-white/40 text-xs font-bold animate-pulse">
                                                    Searching...
                                                </div>
                                            )}

                                            {!userSearchLoading && userSearchResults.length === 0 && userSearchQuery && (
                                                <div className="p-4 text-center text-white/40 text-xs font-bold">
                                                    No users found.
                                                </div>
                                            )}

                                            {userSearchResults.map((user) => (
                                                <button
                                                    key={user.id}
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setAddMemberForm((p) => ({ ...p, user_id: user.id }));
                                                        setShowUserDropdown(false);
                                                        setUserSearchQuery("");
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center justify-between transition-colors border-b border-white/5 last:border-b-0"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-white truncate">{user.full_name}</p>
                                                        <p className="text-xs text-white/40 truncate">{user.email}</p>
                                                    </div>
                                                    {user.is_super_admin && (
                                                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md uppercase flex-shrink-0 ml-2">
                                                            SA
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Role Select */}
                    <div>
                        <label className="text-xs uppercase font-bold text-white/40 tracking-widest block mb-2">Role</label>
                        <select
                            value={addMemberForm.role}
                            onChange={(e) => setAddMemberForm((p) => ({ ...p, role: e.target.value }))}
                            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                        >
                            {MEMBER_ROLE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-[#161616]">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {addMemberError && <p className="text-xs text-red-400 font-bold">{addMemberError}</p>}

                    <Button
                        onClick={handleAddMember}
                        loading={addMemberLoading}
                        disabled={!addMemberForm.user_id.trim()}
                    >
                        Add Member
                    </Button>
                </div>
            </Modal>

            <Modal
                isOpen={changeRoleModalOpen}
                onClose={() => !changeRoleLoading && setChangeRoleModalOpen(false)}
                title="Change Member Role"
                description="Select a new role for this team member."
                size="sm"
            >
                <div className="space-y-4">
                    <div>
                        <label className="text-xs uppercase font-bold text-white/40 tracking-widest block mb-2">New Role</label>
                        <select
                            value={changeRoleForm.role}
                            onChange={(e) => setChangeRoleForm((p) => ({ ...p, role: e.target.value }))}
                            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                        >
                            {MEMBER_ROLE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-[#161616]">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {changeRoleError && <p className="text-xs text-red-400 font-bold">{changeRoleError}</p>}
                    <Button onClick={handleChangeRole} loading={changeRoleLoading}>
                        Update Role
                    </Button>
                </div>
            </Modal>
        </>
    );
}