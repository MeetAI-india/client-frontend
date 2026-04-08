import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, MoreVertical, ArrowUpRight, LayoutGrid, Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import TabBar from "@/components/TabBar";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Form from "@/components/Form";
import { createProject, deleteProject, getProjects, updateProject } from "../api/projects";

// ── Field definitions ────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
    { label: "Not Started", value: "not_started" },
    { label: "In Progress", value: "in_progress" },
    { label: "On Hold", value: "on_hold" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

const PROJECT_FIELDS = [
    {
        key: "name",
        type: "text",
        label: "Project Name",
        placeholder: "e.g. MeetAI Dashboard Redesign",
        required: true,
        col: "left",
    },
    {
        key: "status",
        type: "dropdown",
        label: "Status",
        required: true,
        options: STATUS_OPTIONS,
        col: "left",
    },
    {
        key: "short_description",
        type: "textarea",
        label: "Short Description",
        placeholder: "A concise one or two line summary for project cards",
        rows: 3,
        col: "left",
    },
    {
        key: "deadline",
        type: "date",
        label: "Deadline",
        col: "left",
    },
    {
        key: "description",
        type: "markdown",
        label: "Description",
        placeholder: "What is this project about? What are the goals?\n\n**Supports** _markdown_",
        col: "right",
    },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("in_progress");
    const actionMenuRef = useRef(null);

    // Modal / form state
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({ status: "not_started" });
    const [formLoading, setFormLoading] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [openActionMenuId, setOpenActionMenuId] = useState(null);
    const [serverErrors, setServerErrors] = useState({});
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState("");
    const [projects, setProjects] = useState([]);

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
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!openActionMenuId) return;

        const handleOutsideClick = (event) => {
            if (!actionMenuRef.current?.contains(event.target)) {
                setOpenActionMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [openActionMenuId]);

    const formatStatusLabel = (status) => {
        switch (status) {
            case "not_started":
                return "Not Started";
            case "in_progress":
                return "In Progress";
            case "on_hold":
                return "On Hold";
            case "completed":
                return "Completed";
            case "cancelled":
                return "Cancelled";
            default:
                return status ?? "Unknown";
        }
    };

    const getImportanceFromStatus = (status) => {
        switch (status) {
            case "completed":
                return "success";
            case "on_hold":
                return "high";
            case "in_progress":
                return "medium";
            case "not_started":
                return "default";
            case "cancelled":
                return "critical";
            default:
                return "default";
        }
    };

    const hydratedProjects = useMemo(() => (
        projects.map((project) => ({
            ...project,
            uiStatus: formatStatusLabel(project.status),
            importanceVariant: getImportanceFromStatus(project.status),
        }))
    ), [projects]);

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
        setFormValues(prev => ({ ...prev, [key]: val }));

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
                setProjects((prev) => prev.map((item) => (item.id === project.id ? project : item)));
                setModalOpen(false);
                setEditingProjectId(null);
                setModalMode("create");
                return;
            }

            const created = await createProject(payload);
            const project = created?.data ?? created;
            setProjects((prev) => [project, ...prev]);
            setModalOpen(false);
            navigate(`/projects/${project.id ?? ""}`);
        } catch (e) {
            setServerErrors({ name: e.message });
        } finally {
            setFormLoading(false);
        }
    };

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

    const tabs = [
        { id: "All", label: "All", count: hydratedProjects.length, important: true },
        { id: "in_progress", label: "In Progress", count: hydratedProjects.filter((p) => p.status === "in_progress").length, important: true },
        { id: "completed", label: "Completed", count: hydratedProjects.filter((p) => p.status === "completed").length, important: true },
        { id: "on_hold", label: "On Hold", count: hydratedProjects.filter((p) => p.status === "on_hold").length },
    ];

    const filteredProjects =
        activeTab === "All"
            ? hydratedProjects
            : hydratedProjects.filter((p) => p.status === activeTab);

    return (
        <div className="space-y-8 animate-fade-in">

            {/* ── Header ── */}
            <header className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-black tracking-tight text-white underline decoration-white/10 underline-offset-8">
                        Projects
                    </h1>
                    <Button onClick={openModal}>
                        <Plus size={14} /> New Project
                    </Button>
                </div>
                <p className="text-white/40 font-medium">
                    Keep track of your current high-priority initiatives.
                </p>
            </header>

            {/* ── Tabs ── */}
            <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* ── Grid ── */}
            {projectsLoading ? (
                <div className="text-center py-20 bg-white/[0.03] border border-white/10 rounded-[30px]">
                    <LayoutGrid size={32} className="mx-auto text-white/20 mb-4 animate-pulse" />
                    <p className="text-white/40 font-bold">Loading projects...</p>
                </div>
            ) : projectsError ? (
                <div className="text-center py-20 bg-white/[0.03] border border-red-500/20 rounded-[30px]">
                    <LayoutGrid size={32} className="mx-auto text-red-400/70 mb-4" />
                    <p className="text-red-400 font-bold">{projectsError}</p>
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((p) => (
                        <Card
                            key={p.id}
                            onClick={() => navigate(`/projects/${p.id}`)}
                            className="flex flex-col p-5 hover:-translate-y-1"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Briefcase size={22} className="text-white" />
                                </div>
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
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditModal(p);
                                                }}
                                                className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteProject(p);
                                                }}
                                                className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 mb-6">
                                <h3 className="font-bold text-white mb-1 leading-tight flex items-center gap-2">
                                    {p.name}
                                    {!p.is_active && (
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    )}
                                </h3>
                                <p className="text-sm text-white/50 leading-relaxed">
                                    {p.short_description || p.description || "No description provided yet."}
                                </p>
                            </div>

                            {/* Progress/status bar hidden for now.
                            <div className="space-y-3 mb-6">
                                <div className="flex items-end justify-between">
                                    <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">Status</p>
                                    <p className="text-sm font-black text-white">{p.uiStatus}</p>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${p.status === "completed" ? "bg-green-400" : p.status === "on_hold" ? "bg-yellow-400" : p.status === "cancelled" ? "bg-red-400" : "bg-white"
                                            }`}
                                        style={{
                                            width:
                                                p.status === "completed"
                                                    ? "100%"
                                                    : p.status === "in_progress"
                                                        ? "65%"
                                                        : p.status === "on_hold"
                                                            ? "40%"
                                                            : p.status === "cancelled"
                                                                ? "100%"
                                                                : "15%",
                                        }}
                                    />
                                </div>
                            </div>
                            */}

                            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                                <Badge variant={p.importanceVariant}>
                                    {p.uiStatus}
                                </Badge>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate(`/projects/${p.id}`); }}
                                    className="px-3 py-1.5 text-xs font-bold text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                    Access <ArrowUpRight size={12} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/[0.03] border border-white/10 rounded-[30px]">
                    <LayoutGrid size={32} className="mx-auto text-white/20 mb-4" />
                    <p className="text-white/40 font-bold">No projects found in this category.</p>
                </div>
            )}

            {/* ── New Project Modal ── */}
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
