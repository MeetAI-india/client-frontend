import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Calendar, Globe, LayoutGrid, Lock, Plus, Search, Shield } from "lucide-react";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Dropdown from "@/components/Dropdown";
import Form from "@/components/Form";
import Modal from "@/components/Modal";

import { getProjects } from "../../projects/api/projects";
import { createMeeting, listProjectMeetings } from "../api/meeting";

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
        case "live":
            return { label: "Live", variant: "success" };
        case "processing":
            return { label: "Processing", variant: "high" };
        case "ready":
            return { label: "Ready", variant: "default" };
        case "failed":
            return { label: "Failed", variant: "critical" };
        case "scheduled":
        default:
            return { label: "Scheduled", variant: "medium" };
    }
}

function getVisibilityMeta(visibility) {
    switch (visibility) {
        case "private":
            return { label: "Private", variant: "high", icon: Lock };
        case "restricted":
            return { label: "Restricted", variant: "medium", icon: Shield };
        case "public":
        default:
            return { label: "Public", variant: "success", icon: Globe };
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
        return () => {
            mounted = false;
        };
    }, []);

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
        return () => {
            mounted = false;
        };
    }, [projects, projectsLoading, selectedProjectId]);

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

    return (
        <>
            <div className="space-y-8 animate-fade-in">
                <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-black tracking-tight text-white underline decoration-white/10 underline-offset-8">
                            Meetings
                        </h1>
                        <p className="max-w-2xl text-white/40 font-medium">
                            Browse scheduled sessions across your projects, open meeting details, and create new meetings with the backend access policy built in.
                        </p>
                    </div>

                    <Button onClick={openCreateModal} disabled={projectsLoading || projects.length === 0}>
                        <Plus size={14} /> New Meeting
                    </Button>
                </header>

                <div className="rounded-[30px] border border-white/[0.1] bg-white/[0.03] p-5 transition-colors">
                    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

                    {projectsError ? (
                        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-4 text-red-300">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-bold">Could not load your projects.</p>
                                <p className="mt-1 text-xs text-red-300/80">{projectsError}</p>
                            </div>
                        </div>
                    ) : meetingsError ? (
                        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-4 text-red-300">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-bold">Could not load meetings.</p>
                                <p className="mt-1 text-xs text-red-300/80">{meetingsError}</p>
                            </div>
                        </div>
                    ) : meetingsLoading || projectsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-white/40">
                            <LayoutGrid className="mb-3 animate-pulse" size={32} />
                            <span className="text-xs font-bold uppercase tracking-widest">Loading meetings...</span>
                        </div>
                    ) : filteredMeetings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                                <Calendar size={28} className="text-white/20" />
                            </div>
                            <h3 className="text-white font-bold">No meetings found</h3>
                            <p className="mt-1 max-w-sm text-sm text-white/30">
                                {projects.length === 0
                                    ? "You need access to at least one project before you can create or browse meetings."
                                    : "Try another project filter or search term, or create a new meeting to get started."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {filteredMeetings.map((meeting) => {
                                const statusMeta = getStatusMeta(meeting.status);
                                const visibilityMeta = getVisibilityMeta(meeting.access_policy?.visibility);
                                const VisibilityIcon = visibilityMeta.icon;

                                return (
                                    <Card
                                        key={meeting.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => openMeeting(meeting)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                openMeeting(meeting);
                                            }
                                        }}
                                        className="border-white/5 bg-white/[0.02] p-5 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05]"
                                    >
                                        <div className="flex h-full flex-col gap-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                                                        {meeting.project_name || "Project"}
                                                    </p>
                                                    <h3 className="truncate text-lg font-black tracking-tight text-white">
                                                        {meeting.title}
                                                    </h3>
                                                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/45">
                                                        {meeting.description || "No description or agenda provided yet."}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                                                    <Badge variant={visibilityMeta.variant} className="inline-flex items-center gap-1">
                                                        <VisibilityIcon size={10} />
                                                        {visibilityMeta.label}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Scheduled</p>
                                                    <p className="mt-2 text-sm font-medium text-white/80">
                                                        {formatMeetingDate(meeting.scheduled_at)}
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Access</p>
                                                    <p className="mt-2 text-sm font-medium text-white/80">
                                                        {meeting.access_level === "metadata_only" ? "Metadata only" : "Full details"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

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
