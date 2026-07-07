import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Edit, RotateCcw, AlertTriangle, Plus } from "lucide-react";

import Button from "@/components/Button";
import TabBar from "@/components/TabBar";
import Modal from "@/components/Modal";
import Form from "@/components/Form";

import { getProject, updateProject, reactivateProject } from "../api/projects";
import { PROJECT_FIELDS, formatStatusLabel } from "../constants";

// Import Tab Components
import ProjectInfoTab from "../components/ProjectInfoTab";
import TeamTab from "../components/TeamTab";
import TasksTab from "../components/TasksTab";
import MeetingsTab from "../../meetings/components/MeetingsTab";

const CAN_EDIT = ["owner", "admin", "maintainer"];
const CAN_MANAGE_MEMBERS = ["owner", "admin", "maintainer"];

const SCROLLBAR_STYLE = (
    <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 6px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 99px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.15); }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.08) transparent; }
        
        .collapse-transition {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .collapse-transition.expanded {
            grid-template-rows: 1fr;
        }
        .collapse-content {
            overflow: hidden;
        }
    `}</style>
);

export default function ProjectDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

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

    // Refs for Tab Actions
    const teamTabRef = useRef(null);
    const meetingsTabRef = useRef(null);

    // Modal / form (Project Update)
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [serverErrors, setServerErrors] = useState({});

    // Reactivate
    const [reactivating, setReactivating] = useState(false);

    const tabs = [
        { id: "Info", label: "Project Info", icon: null }, // Added null for icon to simplify imports here
        { id: "Team", label: "Team Members", icon: null },
        { id: "Tasks", label: "Tasks", icon: null },
        { id: "Meetings", label: "Meetings", icon: null },
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

    // ── Render ──────────────────────────────────────────────────────────

    return (
        <>
            {SCROLLBAR_STYLE}

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
                            <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
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
                                        <Button onClick={() => teamTabRef.current?.openAddModal?.()} disabled={loading}>
                                            <Plus size={14} /> Add Member
                                        </Button>
                                    )
                                ) : activeTab === "Tasks" ? (
                                    <Button onClick={() => { /* tasksTabRef.current?.openAddTask?.() */ alert("Add Task functionality coming soon!"); }} disabled={loading}>
                                        <Plus size={14} /> Add Task
                                    </Button>
                                ) : activeTab === "Meetings" ? (
                                    <Button onClick={() => meetingsTabRef.current?.openAddMeeting?.()} disabled={loading}>
                                        <Plus size={14} /> New Meeting
                                    </Button>
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
                                <ProjectInfoTab
                                    project={project}
                                    uiStatus={uiStatus}
                                    formattedDeadline={formattedDeadline}
                                />
                            )}

                            {activeTab === "Team" && (
                                <TeamTab
                                    ref={teamTabRef}
                                    projectId={id}
                                    canManageMembers={canManageMembers}
                                    currentUserId={currentUserId}
                                />
                            )}

                            {activeTab === "Tasks" && <TasksTab />}

                            {activeTab === "Meetings" && (
                                <MeetingsTab
                                    ref={meetingsTabRef}
                                    projectId={id}
                                    projectName={project?.name}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ── Modals (Extracted to root) ── */}
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
        </>
    );
}
