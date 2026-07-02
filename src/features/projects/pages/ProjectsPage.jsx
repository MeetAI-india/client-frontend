import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Briefcase, MoreVertical, ArrowUpRight, LayoutGrid, Plus,
    Trash2, RotateCcw
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import TabBar from "@/components/TabBar";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Form from "@/components/Form";
import {
    createProject, deleteProject, getProjects,
    updateProject, getDeletedProjects, reactivateProject
} from "../api/projects";
import { PROJECT_FIELDS, formatStatusLabel } from "../constants";

// ── Helpers ─────────────────────────────────────────────────────────────────

const CAN_EDIT = ["owner", "admin", "maintainer"];
const CAN_DELETE = ["owner", "admin"];

function getImportanceFromStatus(status) {
    switch (status) {
        case "completed": return "success";
        case "on_hold": return "high";
        case "in_progress": return "medium";
        case "cancelled": return "critical";
        default: return "default";
    }
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
    const navigate = useNavigate();
    const actionMenuRef = useRef(null);

    // Auth
    const isSuperAdmin = useSelector((state) => state.auth.user?.is_super_admin === true);

    // Modal / form state
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({ status: "not_started" });
    const [formLoading, setFormLoading] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [openActionMenuId, setOpenActionMenuId] = useState(null);
    const [serverErrors, setServerErrors] = useState({});

    // Projects list
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState("");
    const [projects, setProjects] = useState([]);

    // Deleted projects (super admin)
    const [deletedProjects, setDeletedProjects] = useState(null);
    const [deletedLoading, setDeletedLoading] = useState(false);
    const [deletedError, setDeletedError] = useState("");
    const [reactivatingId, setReactivatingId] = useState(null);

    // Active tab
    const [activeTab, setActiveTab] = useState("All");

    // ── Load projects ────────────────────────────────────────────────────

    useEffect(() => {
        let mounted = true;

        async function loadProjects() {
            setProjectsLoading(true);
            setProjectsError("");

            try {
                const response = await getProjects();
                if (!mounted) return;
                setProjects(Array.isArray(response?.data) ? response.data : []);
            } catch (error) {
                if (!mounted) return;
                setProjectsError(error.message || "Failed to load projects");
            } finally {
                if (mounted) setProjectsLoading(false);
            }
        }

        loadProjects();
        return () => { mounted = false; };
    }, []);

    // ── Load deleted projects (lazy, uses /project/deleted) ─────────────

    useEffect(() => {
        const isSelected = activeTab === "deleted";
        if (!isSelected || !isSuperAdmin || deletedProjects !== null) return;

        let mounted = true;

        async function loadDeleted() {
            setDeletedLoading(true);
            setDeletedError("");

            try {
                const response = await getDeletedProjects();
                if (!mounted) return;
                setDeletedProjects(Array.isArray(response?.data) ? response.data : []);
            } catch (error) {
                if (!mounted) return;
                setDeletedError(error.message || "Failed to load deleted projects");
            } finally {
                if (mounted) setDeletedLoading(false);
            }
        }

        loadDeleted();
        return () => { mounted = false; };
    }, [activeTab, isSuperAdmin, deletedProjects]);

    // ── Close action menu on outside click ──────────────────────────────

    useEffect(() => {
        if (!openActionMenuId) return;

        const handleOutsideClick = (event) => {
            if (!actionMenuRef.current?.contains(event.target)) {
                setOpenActionMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [openActionMenuId]);

    // ── Derived data ────────────────────────────────────────────────────

    const hydratedProjects = useMemo(() => (
        projects.map((project) => ({
            ...project,
            uiStatus: formatStatusLabel(project.status),
            importanceVariant: getImportanceFromStatus(project.status),
            canEdit: isSuperAdmin || CAN_EDIT.includes(project.user_role),
            canDelete: isSuperAdmin || CAN_DELETE.includes(project.user_role),
        }))
    ), [projects, isSuperAdmin]);

    const tabs = [
        { id: "All", label: "All", count: hydratedProjects.length, important: true },
        { id: "in_progress", label: "In Progress", count: hydratedProjects.filter((p) => p.status === "in_progress").length, important: true },
        { id: "on_hold", label: "On Hold", count: hydratedProjects.filter((p) => p.status === "on_hold").length, important: true },
        { id: "completed", label: "Completed", count: hydratedProjects.filter((p) => p.status === "completed").length, important: false },
        { id: "owned", label: "Owned", count: hydratedProjects.filter((p) => p.user_role === "owner").length, important: false },
        { id: "admin", label: "Can Admin", count: hydratedProjects.filter((p) => CAN_DELETE.includes(p.user_role)).length, important: true },
        ...(isSuperAdmin ? [{ id: "deleted", label: "Deleted", count: deletedProjects?.length ?? 0, important: false, icon: Trash2 }] : []),
    ];

    const filteredProjects = useMemo(() => {
        if (activeTab === "deleted") {
            return (deletedProjects || []).map(p => ({
                ...p,
                uiStatus: formatStatusLabel(p.status),
                importanceVariant: "critical",
                isDeletedView: true
            }));
        }
        if (activeTab === "All") return hydratedProjects;
        if (activeTab === "owned") return hydratedProjects.filter((p) => p.user_role === "owner");
        if (activeTab === "admin") return hydratedProjects.filter((p) => CAN_DELETE.includes(p.user_role));
        return hydratedProjects.filter((p) => p.status === activeTab);
    }, [activeTab, hydratedProjects, deletedProjects]);

    // ── Modal helpers ───────────────────────────────────────────────────

    const openModal = () => {
        setModalMode("create");
        setEditingProjectId(null);
        setFormValues({ status: "not_started" });
        setServerErrors({});
        setModalOpen(true);
    };

    const openEditModal = (project) => {
        setModalMode("edit");
        setEditingProjectId(project.id);
        setFormValues({
            name: project.name ?? "",
            status: project.status ?? "not_started",
            short_description: project.short_description ?? "",
            deadline: project.deadline ?? "",
            description: project.description ?? "",
        });
        setServerErrors({});
        setModalOpen(true);
        setOpenActionMenuId(null);
    };

    const closeModal = () => {
        if (!formLoading) {
            setModalOpen(false);
            setEditingProjectId(null);
            setModalMode("create");
        }
    };

    const handleChange = (key, val) =>
        setFormValues((prev) => ({ ...prev, [key]: val }));

    // ── Submit ──────────────────────────────────────────────────────────

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

            if (modalMode === "edit" && editingProjectId) {
                const updated = await updateProject(editingProjectId, payload);
                const project = updated?.data ?? updated;
                setProjects((prev) =>
                    prev.map((item) => (item.id === project.id ? project : item))
                );
                setModalOpen(false);
                setEditingProjectId(null);
                setModalMode("create");
                return;
            }

            const created = await createProject(payload);
            const project = created?.data ?? created;
            setProjects((prev) => [project, ...prev]);
            setModalOpen(false);
            navigate(`/projects/${project.id ?? ""}`, {
                state: { user_role: "owner" },
            });
        } catch (e) {
            setServerErrors({ name: e.message });
        } finally {
            setFormLoading(false);
        }
    };

    // ── Delete ──────────────────────────────────────────────────────────

    const handleDeleteProject = async (project) => {
        const confirmed = window.confirm(`Delete "${project.name}"?`);
        if (!confirmed) return;

        try {
            await deleteProject(project.id);
            setProjects((prev) => prev.filter((item) => item.id !== project.id));
            setOpenActionMenuId(null);
        } catch (error) {
            setProjectsError(error.message || "Failed to delete project");
        }
    };

    // ── Reactivate (super admin) ────────────────────────────────────────

    const handleReactivate = async (project) => {
        const confirmed = window.confirm(`Reactivate "${project.name}"?`);
        if (!confirmed) return;

        setReactivatingId(project.id);
        try {
            await reactivateProject(project.id);
            setDeletedProjects((prev) =>
                prev ? prev.filter((p) => p.id !== project.id) : prev
            );
        } catch (error) {
            setDeletedError(error.message || "Failed to reactivate project");
        } finally {
            setReactivatingId(null);
        }
    };

    // ── Navigate to detail (pass user_role for permission checks) ───────

    const goToDetail = (project) => {
        navigate(`/projects/${project.id}`, {
            state: { user_role: project.user_role },
        });
    };

    // ── Render ──────────────────────────────────────────────────────────

    return (
        <div className="space-y-8 animate-fade-in">

            {/* ── Header ── */}
            <header className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-xl font-black tracking-tight text-white underline decoration-white/10 underline-offset-8">
                        Projects
                    </h1>
                    {isSuperAdmin && (
                        <Button onClick={openModal}>
                            <Plus size={14} /> New Project
                        </Button>
                    )}
                </div>
                <p className="text-white/40 font-medium">
                    Keep track of your current high-priority initiatives.
                </p>
            </header>

            {/* ── Tabs ── */}
            <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* ── Grid ── */}
            {(activeTab === "deleted" ? deletedLoading : projectsLoading) ? (
                <div className="text-center py-20 bg-white/[0.03] border border-white/10 rounded-[30px]">
                    <LayoutGrid size={20} className="mx-auto text-white/20 mb-4 animate-pulse" />
                    <p className="text-white/40 font-bold">Loading projects...</p>
                </div>
            ) : (activeTab === "deleted" ? deletedError : projectsError) ? (
                <div className="text-center py-20 bg-white/[0.03] border border-red-500/20 rounded-[30px]">
                    <LayoutGrid size={20} className="mx-auto text-red-400/70 mb-4" />
                    <p className="text-red-400 font-bold">{activeTab === "deleted" ? deletedError : projectsError}</p>
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((p) => (
                        <Card
                            key={p.id}
                            onClick={() => !p.isDeletedView && goToDetail(p)}
                            className={`flex flex-col p-5 ${!p.isDeletedView ? "hover:-translate-y-1 cursor-pointer" : "opacity-80"}`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center">
                                    <Briefcase size={22} className="text-white" />
                                </div>
                                {!p.isDeletedView && (p.canEdit || p.canDelete) && (
                                    <div className="relative" ref={openActionMenuId === p.id ? actionMenuRef : null}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenActionMenuId((current) => (current === p.id ? null : p.id));
                                            }}
                                            className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        {openActionMenuId === p.id && (
                                            <div className="absolute right-0 top-12 z-20 min-w-[140px] overflow-hidden rounded-xl border border-white/10 bg-[#161616] shadow-2xl">
                                                {p.canEdit && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openEditModal(p);
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                                                    >
                                                        Update
                                                    </button>
                                                )}
                                                {p.canDelete && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProject(p);
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-xs font-bold uppercase tracking-widest text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 mb-6">
                                <h3 className="font-bold text-white mb-1 leading-tight flex items-center gap-2">
                                    {p.name}
                                    {p.isDeletedView && (
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                    )}
                                </h3>
                                <p className="text-sm text-white/50 leading-relaxed">
                                    {p.short_description || p.description || "No description provided yet."}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                                <Badge variant={p.importanceVariant}>
                                    {p.uiStatus}
                                </Badge>

                                {p.isDeletedView ? (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleReactivate(p); }}
                                        disabled={reactivatingId === p.id}
                                        className="px-3 py-1.5 text-xs font-bold text-white/60 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <RotateCcw size={12} className={reactivatingId === p.id ? "animate-spin" : ""} />
                                        {reactivatingId === p.id ? "Restoring..." : "Reactivate"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); goToDetail(p); }}
                                        className="px-3 py-1.5 text-xs font-bold text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        Access <ArrowUpRight size={12} />
                                    </button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/[0.03] border border-white/10 rounded-[30px]">
                    <LayoutGrid size={20} className="mx-auto text-white/20 mb-4" />
                    <p className="text-white/40 font-bold">
                        {activeTab === "deleted" ? "No deleted projects found." : "No projects found in this category."}
                    </p>
                </div>
            )}

            {/* ── Create / Edit Modal ── */}
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title={modalMode === "edit" ? "Update Project" : "New Project"}
                description={modalMode === "edit" ? "Update the project details below." : "Fill in the details below to create a new project."}
                size="lg"
            >
                <Form
                    fields={PROJECT_FIELDS}
                    values={formValues}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    errors={serverErrors}
                    submitLabel={modalMode === "edit" ? "Update Project" : "Create Project"}
                    loading={formLoading}
                />
            </Modal>
        </div>
    );
}