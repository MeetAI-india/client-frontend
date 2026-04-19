import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { Mail, MoreVertical, Shield, UserMinus, X, Plus } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Form from "@/components/Form";
import {
    getProjectMembers, addProjectMember, removeProjectMember, changeMemberRole,
    searchUsers, getMemberPermissions, updateMemberPermissions, deleteMemberPermissions
} from "../api/projects";
import { formatRoleLabel, MEMBER_ROLE_OPTIONS } from "../constants";

const TeamTab = forwardRef(({ projectId, canManageMembers, currentUserId }, ref) => {
    const memberActionRef = useRef(null);

    useImperativeHandle(ref, () => ({
        openAddModal: () => {
            setAddMemberForm({ user_search: "", user_id: "", role: "member" });
            setUserSearchQuery("");
            setAddMemberError("");
            setAddMemberModalOpen(true);
        }
    }));

    // State
    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [membersError, setMembersError] = useState("");

    // Add Member Modal
    const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [addMemberForm, setAddMemberForm] = useState({ user_search: "", user_id: "", role: "member" });
    const [addMemberLoading, setAddMemberLoading] = useState(false);
    const [addMemberError, setAddMemberError] = useState("");

    // User Search
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

    // Action Menu
    const [openMemberActionId, setOpenMemberActionId] = useState(null);

    // Profile Panel
    const [selectedMember, setSelectedMember] = useState(null);
    const [memberPermissions, setMemberPermissions] = useState(null);
    const [memberPermissionsLoading, setMemberPermissionsLoading] = useState(false);
    const [memberPermissionsError, setMemberPermissionsError] = useState("");
    const [permissionsExpanded, setPermissionsExpanded] = useState(false);
    const [editingPermissions, setEditingPermissions] = useState(false);
    const [editedPermissions, setEditedPermissions] = useState({});

    // ── Effects ────────────────────────────────────────────────────────────

    useEffect(() => {
        let mounted = true;
        async function loadMembers() {
            setMembersLoading(true);
            setMembersError("");
            try {
                const response = await getProjectMembers(projectId);
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
    }, [projectId]);

    // User Search Debounce
    useEffect(() => {
        if (!userSearchQuery.trim() || selectedUser) {
            setUserSearchResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setUserSearchLoading(true);
            try {
                const res = await searchUsers(userSearchQuery, projectId);
                let users = Array.isArray(res?.data?.users) ? res.data.users : (Array.isArray(res?.data) ? res.data : []);
                const existingMemberIds = new Set(members.map((m) => String(m.user_id)));
                const availableUsers = users.filter((u) => {
                    const userId = String(u.id);
                    return userId && !existingMemberIds.has(userId);
                });
                setUserSearchResults(availableUsers);
            } catch (err) {
                console.error(err);
                setUserSearchResults([]);
            } finally {
                setUserSearchLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [userSearchQuery, selectedUser, members]);

    // Outside click close for Action Menu
    useEffect(() => {
        if (!openMemberActionId) return;
        const handleOutsideClick = (event) => {
            if (!memberActionRef.current?.contains(event.target)) setOpenMemberActionId(null);
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [openMemberActionId]);

    // Load Permissions for Sidebar
    useEffect(() => {
        if (!selectedMember) {
            setMemberPermissions(null);
            return;
        }
        let mounted = true;
        async function loadPermissions() {
            setMemberPermissionsLoading(true);
            try {
                const res = await getMemberPermissions(projectId, selectedMember.user_id);
                if (mounted) setMemberPermissions(res?.data ?? res);
            } catch (err) {
                if (mounted) setMemberPermissionsError(err.message);
            } finally {
                if (mounted) setMemberPermissionsLoading(false);
            }
        }
        loadPermissions();
        return () => { mounted = false; };
    }, [projectId, selectedMember]);

    // ── Handlers ─────────────────────────────────────────────────────────

    const handleAddMember = async (data) => {
        setAddMemberLoading(true);
        try {
            const payload = { user_id: data.user_id, role: data.role };
            const res = await addProjectMember(projectId, payload);
            setMembers((prev) => [...prev, res?.data].sort((a, b) => new Date(a.joined_at) - new Date(b.joined_at)));
            setAddMemberModalOpen(false);
        } catch (e) {
            setAddMemberError(e.message);
        } finally {
            setAddMemberLoading(false);
        }
    };

    const handleRemoveMember = async (member) => {
        if (!window.confirm(`Remove "${member.user_name}"?`)) return;
        try {
            await removeProjectMember(projectId, member.user_id);
            setMembers((prev) => prev.filter((m) => m.user_id !== member.user_id));
            setOpenMemberActionId(null);
            if (selectedMember?.user_id === member.user_id) setSelectedMember(null);
        } catch (e) {
            setMembersError(e.message);
        }
    };

    const handleChangeRole = async (data) => {
        setChangeRoleLoading(true);
        try {
            const res = await changeMemberRole(projectId, changingUserId, data);
            setMembers((prev) => prev.map((m) => (m.user_id === changingUserId ? res?.data : m)));
            if (selectedMember?.user_id === changingUserId) setSelectedMember((prev) => ({ ...prev, role: res?.data.role }));
            setChangeRoleModalOpen(false);
        } catch (e) {
            setChangeRoleError(e.message);
        } finally {
            setChangeRoleLoading(false);
        }
    };

    const handleUpdatePermissions = async () => {
        try {
            const res = await updateMemberPermissions(projectId, selectedMember.user_id, editedPermissions);
            setMemberPermissions(res?.data ?? res);
            setEditingPermissions(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemovePermissions = async () => {
        try {
            await deleteMemberPermissions(projectId, selectedMember.user_id);
            const res = await getMemberPermissions(projectId, selectedMember.user_id);
            setMemberPermissions(res?.data ?? res);
            setEditingPermissions(false);
        } catch (err) {
            alert(err.message);
        }
    };

    // ── Form Configurations ───────────────────────────────────────────────

    // The single 'role' field handed to Form; search is handled cleanly as a custom Autocomplete combo above it
    const addMemberRoleField = [
        { key: "role", type: "dropdown", label: "Role", options: MEMBER_ROLE_OPTIONS, required: true }
    ];

    const changeRoleFields = [
        { key: "role", type: "dropdown", label: "Role", options: MEMBER_ROLE_OPTIONS, required: true }
    ];

    const handleChangeRoleFormChange = (key, val) => {
        setChangeRoleForm(p => ({ ...p, [key]: val }));
    };

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <div className="h-full flex flex-col gap-0 relative">

            {/* ── Add Member Modal ── */}
            <Modal
                isOpen={addMemberModalOpen}
                onClose={() => setAddMemberModalOpen(false)}
                title="Add Team Member"
                description="Search for a user to add them to this project."
            >
                <div className="flex flex-col min-h-[320px]">
                    {/* Custom Searchable Combo Input */}
                    <div className="space-y-1.5 flex-col min-h-0 mb-4 z-20">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                            Search & Select User <span className="text-red-400 text-[8px]">●</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={userSearchQuery}
                                onChange={(e) => { 
                                    setUserSearchQuery(e.target.value); 
                                    setShowUserDropdown(true); 
                                    // clear selection if user modifies the text
                                    if (addMemberForm.user_id) setAddMemberForm(p => ({ ...p, user_id: "" }));
                                }}
                                placeholder="Type name or email..."
                                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.3] focus:bg-white/[0.08] transition-all"
                            />
                            {showUserDropdown && userSearchResults.filter(u => !members.some(m => m.user_id === u.id)).length > 0 && (
                                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#1A1A1A] border border-white/10 rounded-xl overflow-y-auto max-h-48 z-[9999] shadow-2xl py-1.5">
                                    {userSearchResults.filter(u => !members.some(m => m.user_id === u.id)).map((u) => (
                                        <div
                                            key={u.id}
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setAddMemberForm((p) => ({ ...p, user_id: u.id }));
                                                setUserSearchQuery(`${u.full_name} (${u.email})`);
                                                setShowUserDropdown(false);
                                            }}
                                            className="px-4 py-2.5 hover:bg-white/10 cursor-pointer text-xs font-bold text-white transition-colors flex items-center justify-between"
                                        >
                                            <div className="flex-1 truncate">{u.full_name}</div>
                                            <div className="text-[10px] text-white/40 font-medium ml-2 truncate">{u.email}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <Form
                        fields={addMemberRoleField}
                        values={addMemberForm}
                        onChange={(k, v) => setAddMemberForm(p => ({ ...p, [k]: v }))}
                        onSubmit={() => {
                            if (!addMemberForm.user_id) {
                                setAddMemberError("Please select a user from the dropdown.");
                                return;
                            }
                            handleAddMember(addMemberForm);
                        }}
                        errors={addMemberError ? { role: addMemberError } : {}}
                        submitLabel="Add Member"
                        loading={addMemberLoading}
                        className="flex-1 flex flex-col justify-between"
                    />
                </div>
            </Modal>

            {/* ── Change Role Modal ── */}
            <Modal
                isOpen={changeRoleModalOpen}
                onClose={() => setChangeRoleModalOpen(false)}
                title="Change Member Role"
                description="Update the role permissions for this member."
            >
                <Form
                    fields={changeRoleFields}
                    values={changeRoleForm}
                    onChange={handleChangeRoleFormChange}
                    onSubmit={handleChangeRole}
                    errors={changeRoleError ? { role: changeRoleError } : {}}
                    submitLabel="Update Role"
                    loading={changeRoleLoading}
                />
            </Modal>

            {/* ── Member List Container ── */}
            <div className="flex flex-col min-h-0">
                <div className="flex items-center px-5 py-3 text-[10px] uppercase font-black tracking-widest text-white/30 border-b border-white/[0.08]">
                    <div className="w-10 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0 pl-4">Member</div>
                    <div className="w-28 flex-shrink-0 hidden md:block text-center">Role</div>
                    <div className="w-24 flex-shrink-0 hidden md:flex justify-center">Status</div>
                    <div className="w-24 flex-shrink-0 flex justify-end">Actions</div>
                </div>

                <div className="overflow-y-auto sidebar-scroll flex-1">
                    {membersLoading ? (
                        <div className="h-full flex items-center justify-center text-white/40">Loading team...</div>
                    ) : (
                        members.map((member, index) => (
                            <div
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                className={`flex items-center px-5 py-4 cursor-pointer transition-all hover:bg-white/[0.03] border-b border-white/[0.05] ${selectedMember?.user_id === member.user_id ? "bg-white/[0.06]" : ""}`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center text-sm font-bold text-white border border-white/[0.08] flex-shrink-0">
                                    {member.user_name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 min-w-0 pl-4">
                                    <h4 className="font-bold text-white text-sm truncate flex items-center gap-2">
                                        {member.user_name}
                                        {member.user_id === currentUserId && <span className="text-[9px] font-bold text-white/25 border border-white/10 px-1.5 py-0.5 rounded-md uppercase">You</span>}
                                    </h4>
                                    <p className="text-xs text-white/35 truncate mt-0.5">{member.user_email}</p>
                                </div>
                                <div className="w-28 flex-shrink-0 hidden md:flex items-center justify-center">
                                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">{formatRoleLabel(member.role)}</span>
                                </div>
                                <div className="w-24 flex-shrink-0 hidden md:flex items-center justify-center">
                                    <Badge variant={member.is_active ? "success" : "high"}>{member.is_active ? "Active" : "Inactive"}</Badge>
                                </div>
                                <div className="w-24 flex-shrink-0 flex items-center justify-end gap-1">
                                    <button className="p-2 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-white" onClick={(e) => e.stopPropagation()}><Mail size={15} /></button>
                                    {canManageMembers && member.user_id !== currentUserId && member.role !== "owner" && (
                                        <div className="relative" ref={openMemberActionId === member.user_id ? memberActionRef : null}>
                                            <button onClick={(e) => { e.stopPropagation(); setOpenMemberActionId((curr) => (curr === member.user_id ? null : member.user_id)); }} className="p-2 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-white"><MoreVertical size={15} /></button>
                                            {openMemberActionId === member.user_id && (
                                                <div className="absolute right-0 top-11 z-20 min-w-[150px] rounded-xl border border-white/10 bg-[#141414] shadow-2xl overflow-hidden">
                                                    <button onClick={() => { setChangingUserId(member.user_id); setChangeRoleForm({ role: member.role }); setChangeRoleModalOpen(true); setOpenMemberActionId(null); }} className="w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/[0.05] hover:text-white flex items-center gap-2.5"><Shield size={13} /> Change Role</button>
                                                    <div className="border-t border-white/[0.06]" />
                                                    <button onClick={() => handleRemoveMember(member)} className="w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-red-400/80 hover:bg-red-500/[0.08] hover:text-red-300 flex items-center gap-2.5"><UserMinus size={13} /> Remove</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Slide-over Profile Panel (Portaled to Body) ── */}
            {createPortal(
                <>
                    {/* Backdrop for outside click - Handles closing the sidebar */}
                    <div
                        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${selectedMember ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                        onClick={() => setSelectedMember(null)}
                    />

                    <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#080808] border-l border-white/[0.1] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-[9999] flex flex-col ${selectedMember ? "translate-x-0" : "translate-x-full"}`}>
                        {selectedMember && (
                            <>
                                <div className="flex items-center justify-between px-8 py-6 shrink-0 border-b border-white/[0.06]">
                                    <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-white/20 rounded-full" />
                                        Member Profile
                                    </h2>
                                    <button onClick={() => setSelectedMember(null)} className="p-2 bg-white/[0.05] rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors border border-white/10"><X size={18} /></button>
                                </div>

                                <div className="flex-1 overflow-y-auto sidebar-scroll px-8 py-8 min-h-0">
                                    <div className="flex flex-col items-center mb-10">
                                        <div className="w-20 h-20 rounded-2xl bg-white/[0.1] mb-4 flex items-center justify-center text-2xl font-black text-white border border-white/10 shadow-lg">{selectedMember.user_name?.charAt(0)?.toUpperCase() || "?"}</div>
                                        <h3 className="text-xl font-black text-white tracking-tight">{selectedMember.user_name}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant={selectedMember.is_active ? "success" : "high"}>{selectedMember.is_active ? "Active" : "Inactive"}</Badge>
                                            {selectedMember.user_id === currentUserId && <span className="text-[9px] font-bold text-white/30 border border-white/10 px-1.5 py-0.5 rounded-md uppercase">You</span>}
                                        </div>
                                        <p className="text-[10px] text-white/50 font-bold mt-1.5 uppercase tracking-widest">{formatRoleLabel(selectedMember.role)}</p>
                                    </div>

                                    <div className="space-y-5">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Member Details</h4>
                                        <div className="flex justify-between items-baseline border-b border-white/5 pb-3"><span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Email</span><span className="text-sm font-medium text-white/80 break-all text-right">{selectedMember.user_email}</span></div>
                                        <div className="flex justify-between items-baseline border-b border-white/5 pb-3"><span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Project Role</span><span className="text-xs font-bold uppercase tracking-widest text-white/60">{formatRoleLabel(selectedMember.role)}</span></div>
                                        <div className="flex justify-between items-baseline border-b border-white/5 pb-3"><span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Joined</span><span className="text-xs font-medium text-white/50">{selectedMember.joined_at ? new Date(selectedMember.joined_at).toLocaleDateString() : "Unknown"}</span></div>
                                    </div>

                                    {/* Permissions Section */}
                                    <div className="mt-10 space-y-4">
                                        <button onClick={() => setPermissionsExpanded(!permissionsExpanded)} className="flex items-center justify-between w-full text-left focus:outline-none group">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">Advance Member Permission</h4>
                                            <div className={`text-white/30 transition-transform duration-300 ${permissionsExpanded ? "rotate-180" : ""}`}>
                                                <Plus size={16} className={permissionsExpanded ? "hidden" : "block"} />
                                                <X size={16} className={permissionsExpanded ? "block" : "hidden"} />
                                            </div>
                                        </button>
                                        <div className={`collapse-transition ${permissionsExpanded ? "expanded" : ""}`}>
                                            <div className="collapse-content">
                                                <Card className="p-5 flex flex-col gap-4 bg-white/[0.02] mt-2">
                                                    {memberPermissionsLoading ? <div className="text-white/40 text-xs font-bold animate-pulse py-2">Loading permissions...</div> : memberPermissionsError ? <div className="text-red-400 text-xs font-bold py-2">{memberPermissionsError}</div> : memberPermissions ? (
                                                        <>
                                                            {editingPermissions ? (
                                                                <div className="space-y-4">
                                                                    {Object.entries(editedPermissions).map(([key, value]) => (
                                                                        <label key={key} className="flex items-center justify-between cursor-pointer group">
                                                                            <span className="text-xs text-white/70 font-medium group-hover:text-white transition-colors">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                                                            <input type="checkbox" checked={value === true} onChange={(e) => setEditedPermissions(prev => ({ ...prev, [key]: e.target.checked }))} className="rounded border-white/10 bg-[#141414] text-blue-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 transition-colors" />
                                                                        </label>
                                                                    ))}
                                                                    <div className="flex gap-3 pt-2"><Button className="flex-1 py-1.5 text-xs h-8" onClick={handleUpdatePermissions}>Save</Button><Button variant="secondary" className="flex-1 py-1.5 text-xs h-8" onClick={() => setEditingPermissions(false)}>Cancel</Button></div>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4">
                                                                    <div className="space-y-3">
                                                                        {Object.entries(memberPermissions.permissions || {}).map(([key, value]) => (
                                                                            <div key={key} className="flex justify-between items-center border-b border-white/[0.03] pb-2 last:border-0 last:pb-0">
                                                                                <span className="text-xs text-white/60">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                                                                {value ? <CheckCircle2 size={14} className="text-green-400/80" /> : <X size={14} className="text-red-400/50" />}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    {(canManageMembers && selectedMember.role !== "owner") && (
                                                                        <div className="flex gap-3 pt-2">
                                                                            <Button variant="secondary" className="flex-1 py-1.5 text-[9px] uppercase font-bold h-8" onClick={() => {
                                                                                setEditingPermissions(true);
                                                                                const initial = memberPermissions.user_override ? {
                                                                                    can_view_meetings: memberPermissions.user_override.can_view_meetings,
                                                                                    can_create_meetings: memberPermissions.user_override.can_create_meetings,
                                                                                    can_edit_meetings: memberPermissions.user_override.can_edit_meetings,
                                                                                    can_delete_meetings: memberPermissions.user_override.can_delete_meetings,
                                                                                    can_manage_members: memberPermissions.user_override.can_manage_members,
                                                                                    can_view_recordings: memberPermissions.user_override.can_view_recordings,
                                                                                    can_view_transcripts: memberPermissions.user_override.can_view_transcripts,
                                                                                    can_view_summaries: memberPermissions.user_override.can_view_summaries,
                                                                                    can_chat_with_ai: memberPermissions.user_override.can_chat_with_ai,
                                                                                } : {
                                                                                    can_view_meetings: memberPermissions.permissions?.can_view_meetings ?? false,
                                                                                    can_create_meetings: memberPermissions.permissions?.can_create_meetings ?? false,
                                                                                    can_edit_meetings: memberPermissions.permissions?.can_edit_meetings ?? false,
                                                                                    can_delete_meetings: memberPermissions.permissions?.can_delete_meetings ?? false,
                                                                                    can_manage_members: memberPermissions.permissions?.can_manage_members ?? false,
                                                                                    can_view_recordings: memberPermissions.permissions?.can_view_recordings ?? false,
                                                                                    can_view_transcripts: memberPermissions.permissions?.can_view_transcripts ?? false,
                                                                                    can_view_summaries: memberPermissions.permissions?.can_view_summaries ?? false,
                                                                                    can_chat_with_ai: memberPermissions.permissions?.can_chat_with_ai ?? false,
                                                                                };
                                                                                setEditedPermissions(initial);
                                                                            }}>Edit Overrides</Button>
                                                                            {memberPermissions.user_override && <Button variant="secondary" className="flex-1 py-1.5 text-[9px] uppercase font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8" onClick={handleRemovePermissions}>Remove</Button>}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : null}
                                                </Card>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="px-8 py-6 border-t border-white/[0.06] shrink-0 bg-[#050505] flex flex-col gap-3">
                                    <Button variant="secondary" className="w-full py-3 text-white/70 hover:text-white flex items-center justify-center gap-2" onClick={() => window.open(`mailto:${selectedMember.user_email}`, "_blank")}><Mail size={14} /> Send Email</Button>
                                    {canManageMembers && selectedMember.user_id !== currentUserId && selectedMember.role !== "owner" && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="secondary" className="w-full py-3 text-white/70 hover:text-white flex items-center justify-center gap-2" onClick={() => { setChangingUserId(selectedMember.user_id); setChangeRoleForm({ role: selectedMember.role }); setChangeRoleModalOpen(true); }}><Shield size={14} /> Change Role</Button>
                                            <Button variant="secondary" className="w-full py-3 text-red-400/70 hover:text-red-300 flex items-center justify-center gap-2 hover:bg-red-500/10" onClick={() => handleRemoveMember(selectedMember)}><UserMinus size={14} /> Remove</Button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </>,
                document.body
            )}
        </div>
    );
});

export default TeamTab;