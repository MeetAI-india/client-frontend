import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertCircle, Calendar, Globe, LayoutGrid, Lock,
    MoreVertical, Plus, Search, Shield, Trash2
} from "lucide-react";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Dropdown from "@/components/Dropdown";
import Form from "@/components/Form";
import Modal from "@/components/Modal";

import { getProjects } from "../../projects/api/projects";
import { createMeeting, deleteMeeting, listProjectMeetings } from "../api/meeting";

const CREATE_MEETING_FIELDS = [
    {
        key: "project_id",
        label: "Project",
        type: "dropdown",
        required: true,
        placeholder: "Select a project",
        options: [],
    },
    {
        key: "title",
        label: "Meeting Title",
        type: "text",
        required: true,
        placeholder: "e.g. Q4 roadmap sync",
    },
    {
        key: "scheduled_at",
        label: "Scheduled Time",
        type: "datetime-local",
        placeholder: "Choose a date and time",
    },
    {
        key: "meeting_url",
        label: "Meeting URL",
        type: "url",
        placeholder: "https://meet.example.com/room",
    },
    {
        key: "visibility",
        label: "Visibility",
        type: "dropdown",
        required: true,
        options: [
            { label: "Public", value: "public" },
            { label: "Restricted", value: "restricted" },
            { label: "Private", value: "private" },
        ],
    },
    {
        key: "description",
        label: "Description / Agenda",
        type: "textarea",
        rows: 4,
        placeholder: "Add agenda notes, context, or goals for this meeting...",
    },
];

function getStatusMeta(status) {
    switch (status) {
        case "live": return { label: "Live", variant: "success" };
        case "processing": return { label: "Processing", variant: "high" };
        case "ready": return { label: "Ready", variant: "default" };
        case "failed": return { label: "Failed", variant: "critical" };
        case "scheduled":
        default: return { label: "Scheduled", variant: "medium" };
    }
}

function getVisibilityMeta(visibility) {
    switch (visibility) {
        case "private": return { label: "Private", variant: "high", icon: Lock };
        case "restricted": return { label: "Restricted", variant: "medium", icon: Shield };
        case "public":
        default: return { label: "Public", variant: "success", icon: Globe };
    }
}

function formatMeetingDate(value) {
    if (!value) return "Not scheduled";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function normalizeCreatePayload(values) {
    return {
        title: values.title.trim(),
        description: values.description?.trim() || null,
        meeting_url: values.meeting_url?.trim() || null,
        scheduled_at: values.scheduled_at ? new Date(values.scheduled_at).toISOString() : null,
        visibility: values.visibility || "public",
    };
}

// Helper to truncate text to letter count
function truncateText(text, limit) {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
}

export default function MeetingsPage() {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState("");

    const [selectedProjectId, setSelectedProjectId] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [meetings, setMeetings] = useState([]);
    const [meetingsLoading, setMeetingsLoading] = useState(true);
    const [meetingsError, setMeetingsError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        project_id: "",
        title: "",
        scheduled_at: "",
        meeting_url: "",
        visibility: "public",
        description: "",
    });
    const [formLoading, setFormLoading] = useState(false);
    const [serverErrors, setServerErrors] = useState({});

    const actionMenuRef = useRef(null);
    const [openActionMenuId, setOpenActionMenuId] = useState(null);

    // ── Load Projects ────────────────────────────────────────────────────

    useEffect(() => {
        let mounted = true;

        async function loadProjects() {
            setProjectsLoading(true);
            setProjectsError("");

            try {
                const response = await getProjects();
                if (!mounted) return;

                const nextProjects = Array.isArray(response?.data) ? response.data : [];
                setProjects(nextProjects);

                if (nextProjects.length > 0) {
                    setFormValues((prev) => ({
                        ...prev,
                        project_id: prev.project_id || nextProjects[0].id,
                    }));
                }
            } catch (error) {
                if (!mounted) return;
                setProjectsError(error.message || "Failed to load projects.");
            } finally {
                if (mounted) setProjectsLoading(false);
            }
        }

        loadProjects();
        return () => { mounted = false; };
    }, []);

    // ── Load Meetings ─────────────────────────────────────────────────────

    useEffect(() => {
        let mounted = true;

        async function loadMeetings() {
            if (projectsLoading) return;

            if (projects.length === 0) {
                setMeetings([]);
                setMeetingsLoading(false);
                return;
            }

            setMeetingsLoading(true);
            setMeetingsError("");

            try {
                if (selectedProjectId === "all") {
                    const results = await Promise.allSettled(
                        projects.map(async (project) => {
                            const response = await listProjectMeetings(project.id);
                            return {
                                project,
                                meetings: Array.isArray(response?.data?.meetings) ? response.data.meetings : [],
                            };
                        })
                    );

                    if (!mounted) return;

                    const mergedMeetings = results.flatMap((result) => {
                        if (result.status !== "fulfilled") return [];

                        return result.value.meetings.map((meeting) => ({
                            ...meeting,
                            project_name: result.value.project.name,
                        }));
                    });

                    setMeetings(mergedMeetings);
                } else {
                    const response = await listProjectMeetings(selectedProjectId);
                    if (!mounted) return;

                    const activeProject = projects.find((project) => project.id === selectedProjectId);
                    const nextMeetings = Array.isArray(response?.data?.meetings) ? response.data.meetings : [];

                    setMeetings(
                        nextMeetings.map((meeting) => ({
                            ...meeting,
                            project_name: activeProject?.name || response?.data?.project_name || "Project",
                        }))
                    );
                }
            } catch (error) {
                if (!mounted) return;
                setMeetingsError(error.message || "Failed to load meetings.");
            } finally {
                if (mounted) setMeetingsLoading(false);
            }
        }

        loadMeetings();
        return () => { mounted = false; };
    }, [projects, projectsLoading, selectedProjectId]);

    // ── Dropdown / Outside Click ───────────────────────────────────────────

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

    // ── Derived Data ─────────────────────────────────────────────────────

    const projectOptions = useMemo(() => ([
        { value: "all", label: "All Projects" },
        ...projects.map((project) => ({
            value: project.id,
            label: project.name,
        })),
    ]), [projects]);

    const createFields = useMemo(() => (
        CREATE_MEETING_FIELDS.map((field) => (
            field.key === "project_id"
                ? { ...field, options: projects.map((project) => ({ value: project.id, label: project.name })) }
                : field
        ))
    ), [projects]);

    const filteredMeetings = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        const nextMeetings = meetings
            .filter((meeting) => {
                if (!query) return true;

                return [
                    meeting.title,
                    meeting.description,
                    meeting.project_name,
                ].some((value) => typeof value === "string" && value.toLowerCase().includes(query));
            })
            .sort((left, right) => {
                const leftDate = new Date(left.scheduled_at || left.created_at || 0).getTime();
                const rightDate = new Date(right.scheduled_at || right.created_at || 0).getTime();
                return rightDate - leftDate;
            });

        return nextMeetings;
    }, [meetings, searchQuery]);

    const activeProjectName = useMemo(() => {
        if (selectedProjectId === "all") return "All Projects";
        return projects.find((project) => project.id === selectedProjectId)?.name || "Project";
    }, [projects, selectedProjectId]);

    // ── Actions ─────────────────────────────────────────────────────────

    const openCreateModal = () => {
        setServerErrors({});
        setFormValues((prev) => ({
            project_id: prev.project_id || projects[0]?.id || "",
            title: "",
            scheduled_at: "",
            meeting_url: "",
            visibility: "public",
            description: "",
        }));
        setModalOpen(true);
    };

    const closeCreateModal = () => {
        if (!formLoading) {
            setModalOpen(false);
        }
    };

    const handleChange = (key, value) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleCreateMeeting = async (values) => {
        setFormLoading(true);
        setServerErrors({});

        try {
            const response = await createMeeting(values.project_id, normalizeCreatePayload(values));
            const createdMeeting = response?.data ?? response;
            const selectedProject = projects.find((project) => project.id === values.project_id);
            const hydratedMeeting = {
                ...createdMeeting,
                project_name: selectedProject?.name || "Project",
            };

            setMeetings((prev) => {
                if (selectedProjectId !== "all" && selectedProjectId !== values.project_id) return prev;
                return [hydratedMeeting, ...prev];
            });

            setModalOpen(false);
            navigate(`/meetings/${hydratedMeeting.id}?projectId=${values.project_id}`, {
                state: {
                    projectId: values.project_id,
                    projectName: hydratedMeeting.project_name,
                },
            });
        } catch (error) {
            setServerErrors({
                title: error.message || "Failed to create meeting.",
            });
        } finally {
            setFormLoading(false);
        }
    };

    const openMeeting = (meeting) => {
        navigate(`/meetings/${meeting.id}?projectId=${meeting.project_id}`, {
            state: {
                projectId: meeting.project_id,
                projectName: meeting.project_name,
            },
        });
    };

    const handleDeleteMeeting = async (meeting) => {
        const confirmed = window.confirm(`Permanently delete session "${meeting.title}"?`);
        if (!confirmed) return;

        try {
            await deleteMeeting(meeting.project_id, meeting.id);
            setMeetings((prev) => prev.filter((m) => m.id !== meeting.id));
            setOpenActionMenuId(null);
        } catch (err) {
            alert(err.message || "Failed to delete meeting.");
        }
    };

    return (
        <>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-3xl font-black tracking-tight text-white underline decoration-white/10 underline-offset-8">
                            Meetings
                        </h1>
                        <Button onClick={openCreateModal} disabled={projectsLoading || projects.length === 0}>
                            <Plus size={14} /> New Meeting
                        </Button>
                    </div>
                    <p className="text-white/40 font-medium">
                        Browse scheduled sessions across your projects, open meeting details, and create new meetings with the backend access policy built in.
                    </p>
                </header>

                {/* Controls */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-black tracking-tight text-white">Session Registry</h2>
                        <p className="mt-1 text-sm text-white/35">
                            {selectedProjectId === "all"
                                ? "Combined view across all accessible projects."
                                : `Currently showing meetings for ${activeProjectName}.`}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <Dropdown
                            label="Filter by Project"
                            options={projectOptions}
                            value={selectedProjectId}
                            onChange={setSelectedProjectId}
                        />

                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 transition-all focus-within:border-white/20">
                            <Search size={14} className="text-white/30" />
                            <input
                                type="text"
                                placeholder="Search meetings..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="w-40 bg-transparent text-sm font-bold text-white/70 placeholder:text-white/20 focus:outline-none md:w-56"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {(projectsLoading || meetingsLoading) ? (
                    <div className="text-center py-20 bg-white/[0.03] border border-white/10 rounded-[30px]">
                        <LayoutGrid size={32} className="mx-auto text-white/20 mb-4 animate-pulse" />
                        <p className="text-white/40 font-bold">Loading meetings...</p>
                    </div>
                ) : (projectsError || meetingsError) ? (
                    <div className="text-center py-20 bg-white/[0.03] border border-red-500/20 rounded-[30px]">
                        <AlertCircle size={32} className="mx-auto text-red-400/70 mb-4" />
                        <p className="text-red-400 font-bold">{projectsError || meetingsError}</p>
                    </div>
                ) : filteredMeetings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMeetings.map((meeting) => {
                            const statusMeta = getStatusMeta(meeting.status);
                            const visibilityMeta = getVisibilityMeta(meeting.access_policy?.visibility);
                            const VisibilityIcon = visibilityMeta.icon;

                            return (
                                <Card
                                    key={meeting.id}
                                    onClick={() => openMeeting(meeting)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            openMeeting(meeting);
                                        }
                                    }}
                                    className="flex flex-col p-5 hover:-translate-y-1 cursor-pointer transition-all duration-200"
                                >
                                    {/* Top Row: Icon + Menu */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center">
                                            <Calendar size={22} className="text-white" />
                                        </div>

                                        <div className="relative" ref={openActionMenuId === meeting.id ? actionMenuRef : null}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenActionMenuId((curr) => (curr === meeting.id ? null : meeting.id));
                                                }}
                                                className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openActionMenuId === meeting.id && (
                                                <div className="absolute right-0 top-12 z-20 min-w-[140px] overflow-hidden rounded-xl border border-white/10 bg-[#161616] shadow-2xl">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteMeeting(meeting);
                                                        }}
                                                        className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 mb-4">
                                        <h3 className="font-bold text-white mb-1 leading-tight">
                                            {meeting.title}
                                        </h3>
                                        <p className="text-[10px] uppercase font-bold text-white/30 mb-2 tracking-wider">
                                            {meeting.project_name || "Project"}
                                        </p>
                                        <p className="text-sm text-white/50 leading-relaxed">
                                            {truncateText(meeting.description, 80) || "No description or agenda provided yet."}
                                        </p>
                                    </div>

                                    {/* Footer: Badges (Side by Side) | Time (Right) */}
                                    <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={statusMeta.variant} className="whitespace-nowrap">
                                                {statusMeta.label}
                                            </Badge>
                                            <Badge
                                                variant={visibilityMeta.variant}
                                                className="inline-flex items-center gap-1 whitespace-nowrap"
                                            >
                                                <VisibilityIcon size={10} />
                                                {visibilityMeta.label}
                                            </Badge>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-white/60">
                                                <Calendar size={12} />
                                                <span className="text-xs font-bold text-white/60">
                                                    {formatMeetingDate(meeting.scheduled_at)}
                                                </span>
                                            </div>
                                            <p className="text-[10px] uppercase text-white/30 mt-1">
                                                {meeting.access_level === "metadata_only" ? "Metadata only" : "Full details"}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/[0.03] border border-white/10 rounded-[30px]">
                        <LayoutGrid size={32} className="mx-auto text-white/20 mb-4" />
                        <p className="text-white/40 font-bold">No meetings found</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={closeCreateModal}
                title="Create Meeting"
                description="Schedule a new meeting in one of your projects. The backend will create the access policy automatically."
                size="lg"
            >
                <Form
                    fields={createFields}
                    values={formValues}
                    onChange={handleChange}
                    onSubmit={handleCreateMeeting}
                    errors={serverErrors}
                    submitLabel="Create Meeting"
                    loading={formLoading}
                />
            </Modal>
        </>
    );
}