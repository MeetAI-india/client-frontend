import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from "react";
import { AlertCircle, Calendar, Globe, LayoutGrid, Lock, Plus, Search, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        placeholder: "e.g. Weekly delivery sync",
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

const MeetingsTab = forwardRef(function MeetingsTab({ projectId, projectName }, ref) {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(projectId || "all");

    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        project_id: projectId || "",
        title: "",
        scheduled_at: "",
        meeting_url: "",
        visibility: "public",
        description: "",
    });
    const [formLoading, setFormLoading] = useState(false);
    const [serverErrors, setServerErrors] = useState({});

    const openCreateModal = useCallback(() => {
        const defaultProjectId = projectId || selectedProjectId || projects[0]?.id || "";
        setServerErrors({});
        setFormValues({
            project_id: defaultProjectId === "all" ? projects[0]?.id || "" : defaultProjectId,
            title: "",
            scheduled_at: "",
            meeting_url: "",
            visibility: "public",
            description: "",
        });
        setModalOpen(true);
    }, [projectId, projects, selectedProjectId]);

    useImperativeHandle(ref, () => ({
        openAddMeeting: openCreateModal,
    }), [openCreateModal]);

    useEffect(() => {
        setSelectedProjectId(projectId || "all");
        setFormValues((prev) => ({
            ...prev,
            project_id: projectId || prev.project_id,
        }));
    }, [projectId]);

    useEffect(() => {
        if (projectId) return;

        let mounted = true;

        async function loadProjects() {
            setProjectsLoading(true);
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
            } catch {
                if (!mounted) return;
                setProjects([]);
            } finally {
                if (mounted) setProjectsLoading(false);
            }
        }

        loadProjects();
        return () => {
            mounted = false;
        };
    }, [projectId]);

    useEffect(() => {
        let mounted = true;

        async function loadMeetings() {
            if (!projectId && projectsLoading) return;

            const effectiveProjectId = projectId || selectedProjectId;
            if (!effectiveProjectId || effectiveProjectId === "all") {
                setMeetings([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response = await listProjectMeetings(effectiveProjectId);
                if (!mounted) return;

                const nextMeetings = Array.isArray(response?.data?.meetings) ? response.data.meetings : [];
                const resolvedProjectName =
                    projectName ||
                    projects.find((project) => project.id === effectiveProjectId)?.name ||
                    response?.data?.project_name ||
                    "Project";

                setMeetings(
                    nextMeetings.map((meeting) => ({
                        ...meeting,
                        project_name: resolvedProjectName,
                    }))
                );
            } catch (err) {
                if (!mounted) return;
                setError(err.message || "Failed to load meetings.");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadMeetings();
        return () => {
            mounted = false;
        };
    }, [projectId, projectName, projects, projectsLoading, selectedProjectId]);

    const filteredMeetings = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return meetings
            .filter((meeting) => {
                if (!query) return true;
                return [meeting.title, meeting.description].some(
                    (value) => typeof value === "string" && value.toLowerCase().includes(query)
                );
            })
            .sort((left, right) => {
                const leftDate = new Date(left.scheduled_at || left.created_at || 0).getTime();
                const rightDate = new Date(right.scheduled_at || right.created_at || 0).getTime();
                return rightDate - leftDate;
            });
    }, [meetings, searchQuery]);

    const createFields = useMemo(() => (
        CREATE_MEETING_FIELDS.map((field) => {
            if (field.key !== "project_id") return field;

            if (projectId) {
                return {
                    ...field,
                    options: [{ value: projectId, label: projectName || "Current Project" }],
                };
            }

            return {
                ...field,
                options: projects.map((project) => ({
                    value: project.id,
                    label: project.name,
                })),
            };
        })
    ), [projectId, projectName, projects]);

    const dropdownOptions = useMemo(() => (
        projectId
            ? []
            : [
                { value: "all", label: "All Projects" },
                ...projects.map((project) => ({ value: project.id, label: project.name })),
            ]
    ), [projectId, projects]);

    const handleChange = (key, value) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleCreateMeeting = async (values) => {
        const targetProjectId = projectId || values.project_id;
        if (!targetProjectId) return;

        setFormLoading(true);
        setServerErrors({});

        try {
            const response = await createMeeting(targetProjectId, normalizeCreatePayload(values));
            const createdMeeting = response?.data ?? response;
            const resolvedProjectName =
                projectName ||
                projects.find((project) => project.id === targetProjectId)?.name ||
                "Project";

            const hydratedMeeting = {
                ...createdMeeting,
                project_name: resolvedProjectName,
            };

            setMeetings((prev) => [hydratedMeeting, ...prev]);
            setModalOpen(false);

            navigate(`/meetings/${hydratedMeeting.id}?projectId=${targetProjectId}`, {
                state: {
                    projectId: targetProjectId,
                    projectName: resolvedProjectName,
                },
            });
        } catch (err) {
            setServerErrors({
                title: err.message || "Failed to create meeting.",
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
            <div className="h-full flex flex-col min-h-[400px]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h3 className="font-black text-white text-lg tracking-tight flex items-center gap-3">
                            Session Registry
                        </h3>
                        <p className="mt-1 text-sm text-white/35">
                            {projectId
                                ? "Live meeting list for this project."
                                : "Browse meetings by project and jump into the detail view."}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {!projectId && (
                            <Dropdown
                                options={dropdownOptions}
                                value={selectedProjectId}
                                onChange={setSelectedProjectId}
                                label="Filter by Project"
                            />
                        )}

                        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 transition-all focus-within:border-white/20">
                            <Search size={14} className="text-white/30" />
                            <input
                                type="text"
                                placeholder="Search sessions..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="bg-transparent text-sm text-white/70 font-bold focus:outline-none placeholder-white/20 w-32 md:w-48"
                            />
                        </div>

                        {projectId && (
                            <Button onClick={openCreateModal} variant="secondary">
                                <Plus size={14} /> New Meeting
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto sidebar-scroll min-h-0">
                    {error ? (
                        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-4 text-red-300">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-bold">Could not load meetings.</p>
                                <p className="mt-1 text-xs text-red-300/80">{error}</p>
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-white/40">
                            <LayoutGrid className="animate-pulse mb-3" size={32} />
                            <span className="text-xs font-bold uppercase tracking-widest">Loading sessions...</span>
                        </div>
                    ) : filteredMeetings.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center mb-4">
                                <Calendar size={28} className="text-white/20" />
                            </div>
                            <h4 className="text-white font-bold mb-1">No meetings found</h4>
                            <p className="text-white/30 text-sm max-w-[280px]">
                                {projectId
                                    ? "This project does not have any meetings yet."
                                    : "Pick a project to see its meetings, or narrow your search."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 px-1">
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
                                        className="p-5 group transition-all duration-200 hover:bg-white/[0.05] hover:border-white/20 cursor-pointer border-white/5 bg-white/[0.02]"
                                    >
                                        <div className="relative z-10 flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white/[0.08] border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                                <Calendar size={22} className="text-white/80" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-white mb-1 leading-tight truncate text-base">{meeting.title}</h4>
                                                <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider">
                                                    {formatMeetingDate(meeting.scheduled_at)}
                                                </p>
                                                {meeting.description && (
                                                    <p className="mt-2 text-sm text-white/35 line-clamp-1">
                                                        {meeting.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="hidden md:flex items-center gap-2 flex-shrink-0 pr-4 border-r border-white/10 mr-4">
                                                <Badge variant={visibilityMeta.variant} className="inline-flex items-center gap-1">
                                                    <VisibilityIcon size={10} />
                                                    {visibilityMeta.label}
                                                </Badge>
                                            </div>

                                            <Badge variant={statusMeta.variant}>
                                                {statusMeta.label}
                                            </Badge>
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
                onClose={() => {
                    if (!formLoading) setModalOpen(false);
                }}
                title="Create Meeting"
                description="Schedule a new meeting for this project."
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
});

export default MeetingsTab;
