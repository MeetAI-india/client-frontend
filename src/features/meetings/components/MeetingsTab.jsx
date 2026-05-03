import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Calendar, Edit, Globe, LayoutGrid, Lock, MoreVertical, Plus, Search, Shield, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Dropdown from "@/components/Dropdown";
import Form from "@/components/Form";
import Modal from "@/components/Modal";

import { getProjects } from "../../projects/api/projects";
import { addParticipant, changeParticipantRole, createMeeting, deleteMeeting, listParticipants, listProjectMeetings, removeParticipant, updateMeeting, updateMeetingPolicy } from "../api/meeting";

// ✅ Import EDIT_MEETING_FIELDS and helpers from constants
import {
    EDIT_MEETING_FIELDS,
    getStatusMeta,
    getVisibilityMeta,
    getParticipantRoleMeta,
    formatDateTime,
    toDateTimeLocalValue,
    resolveMeetingProject
} from "../constants";

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

// Remove local helper definitions if they were here, they are now in constants.js
// remove local EDIT_MEETING_FIELDS definition

function formatMeetingDate(value) {
    return formatDateTime(value, "Not scheduled");
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

const ADD_PARTICIPANT_FIELDS = [
    {
        key: "user_email",
        label: "User Email",
        type: "email",
        required: true,
        placeholder: "colleague@example.com",
    },
    {
        key: "role",
        label: "Role",
        type: "dropdown",
        required: true,
        options: [
            { label: "Viewer", value: "viewer" },
            { label: "Commenter", value: "commenter" },
            { label: "Editor", value: "editor" },
        ],
    },
];

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

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormValues, setEditFormValues] = useState({});
    const [editFormLoading, setEditFormLoading] = useState(false);
    const [editServerErrors, setEditServerErrors] = useState({});
    const [editMeetingId, setEditMeetingId] = useState(null);

    const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
    const [participantsMeetingId, setParticipantsMeetingId] = useState(null);
    const [participantsList, setParticipantsList] = useState([]);
    const [participantsLoading, setParticipantsLoading] = useState(false);
    const [participantsError, setParticipantsError] = useState("");

    const [addParticipantFormOpen, setAddParticipantFormOpen] = useState(false);
    const [addParticipantValues, setAddParticipantValues] = useState({ user_email: "", role: "viewer" });
    const [addParticipantLoading, setAddParticipantLoading] = useState(false);
    const [addParticipantErrors, setAddParticipantErrors] = useState({});

    const actionMenuRef = useRef(null);
    const triggerRefs = useRef({});
    const [openActionMenuId, setOpenActionMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

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
        if (!openActionMenuId) return;

        const handleOutsideClick = (event) => {
            const menuEl = actionMenuRef.current;
            const triggerEl = triggerRefs.current[openActionMenuId];
            if (
                !menuEl?.contains(event.target) &&
                !triggerEl?.contains(event.target)
            ) {
                setOpenActionMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [openActionMenuId]);

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

    const openEditModal = (meeting) => {
        setEditMeetingId(meeting.id);
        setEditServerErrors({});
        setEditFormValues({
            title: meeting.title ?? "",
            scheduled_at: toDateTimeLocalValue(meeting.scheduled_at),
            meeting_url: meeting.meeting_url ?? "",
            description: meeting.description ?? "",
            visibility: meeting.access_policy?.visibility ?? "public",
            gate_recording: meeting.access_policy?.gate_recording ?? false,
            gate_transcript: meeting.access_policy?.gate_transcript ?? false,
            gate_summary: meeting.access_policy?.gate_summary ?? false,
        });
        setOpenActionMenuId(null);
        setEditModalOpen(true);
    };

    const handleEditChange = (key, value) => {
        setEditFormValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleEditSubmit = async (values) => {
        const meeting = meetings.find((m) => m.id === editMeetingId);
        if (!meeting) return;

        const targetProjectId = projectId || meeting.project_id;
        if (!targetProjectId) return;

        setEditFormLoading(true);
        setEditServerErrors({});

        try {
            const meetingPayload = {};
            const nextTitle = values.title.trim();
            const nextDescription = values.description?.trim() || null;
            const nextMeetingUrl = values.meeting_url?.trim() || null;
            const nextScheduledAt = values.scheduled_at ? new Date(values.scheduled_at).toISOString() : null;

            if (nextTitle !== (meeting.title ?? "")) meetingPayload.title = nextTitle;
            if (nextDescription !== (meeting.description ?? null)) meetingPayload.description = nextDescription;
            if (nextMeetingUrl !== (meeting.meeting_url ?? null)) meetingPayload.meeting_url = nextMeetingUrl;
            if (nextScheduledAt !== (meeting.scheduled_at ?? null)) meetingPayload.scheduled_at = nextScheduledAt;

            if (Object.keys(meetingPayload).length > 0) {
                const response = await updateMeeting(targetProjectId, meeting.id, meetingPayload);
                const updatedMeeting = response?.data ?? response;
                setMeetings((prev) =>
                    prev.map((m) =>
                        m.id === meeting.id
                            ? { ...m, ...updatedMeeting, project_name: m.project_name }
                            : m
                    )
                );
            }

            const currentPolicy = meeting.access_policy ?? {};
            const policyPayload = {};
            const nextVisibility = values.visibility || "public";
            const nextGateRecording = !!values.gate_recording;
            const nextGateTranscript = !!values.gate_transcript;
            const nextGateSummary = !!values.gate_summary;

            if (nextVisibility !== (currentPolicy.visibility ?? "public")) policyPayload.visibility = nextVisibility;
            if (nextGateRecording !== !!currentPolicy.gate_recording) policyPayload.gate_recording = nextGateRecording;
            if (nextGateTranscript !== !!currentPolicy.gate_transcript) policyPayload.gate_transcript = nextGateTranscript;
            if (nextGateSummary !== !!currentPolicy.gate_summary) policyPayload.gate_summary = nextGateSummary;

            if (Object.keys(policyPayload).length > 0) {
                const policyResponse = await updateMeetingPolicy(targetProjectId, meeting.id, policyPayload);
                const updatedPolicy = policyResponse?.data ?? policyResponse;
                setMeetings((prev) =>
                    prev.map((m) =>
                        m.id === meeting.id
                            ? {
                                ...m,
                                access_policy: {
                                    ...(m.access_policy ?? {}),
                                    ...updatedPolicy,
                                },
                                project_name: m.project_name,
                            }
                            : m
                    )
                );
            }

            if (Object.keys(meetingPayload).length === 0 && Object.keys(policyPayload).length === 0) {
                setEditModalOpen(false);
                return;
            }

            setEditModalOpen(false);
        } catch (err) {
            setEditServerErrors({ title: err.message || "Failed to update meeting." });
        } finally {
            setEditFormLoading(false);
        }
    };

    const openParticipantsModal = async (meeting) => {
        const targetProjectId = projectId || meeting.project_id;
        if (!targetProjectId) return;

        setOpenActionMenuId(null);
        setParticipantsMeetingId(meeting.id);
        setParticipantsList([]);
        setParticipantsError("");
        setParticipantsLoading(true);
        setParticipantsModalOpen(true);
        setAddParticipantFormOpen(false);
        setAddParticipantValues({ user_email: "", role: "viewer" });
        setAddParticipantErrors({});

        try {
            const response = await listParticipants(targetProjectId, meeting.id);
            setParticipantsList(Array.isArray(response?.data) ? response.data : []);
        } catch (err) {
            setParticipantsError(err.message || "Failed to load participants.");
        } finally {
            setParticipantsLoading(false);
        }
    };

    const getParticipantsProjectId = () => {
        const meeting = meetings.find((m) => m.id === participantsMeetingId);
        return projectId || meeting?.project_id || "";
    };

    const reloadParticipants = async () => {
        const targetProjectId = getParticipantsProjectId();
        if (!targetProjectId || !participantsMeetingId) return;

        setParticipantsLoading(true);
        setParticipantsError("");

        try {
            const response = await listParticipants(targetProjectId, participantsMeetingId);
            setParticipantsList(Array.isArray(response?.data) ? response.data : []);
        } catch (err) {
            setParticipantsError(err.message || "Failed to load participants.");
        } finally {
            setParticipantsLoading(false);
        }
    };

    const handleAddParticipant = async (values) => {
        const email = values.user_email.trim();
        if (!email) return;

        const targetProjectId = getParticipantsProjectId();
        if (!targetProjectId || !participantsMeetingId) return;

        setAddParticipantLoading(true);
        setAddParticipantErrors({});

        try {
            await addParticipant(targetProjectId, participantsMeetingId, {
                user_email: email,
                role: values.role,
            });
            setAddParticipantValues({ user_email: "", role: "viewer" });
            setAddParticipantFormOpen(false);
            await reloadParticipants();
        } catch (err) {
            setAddParticipantErrors({ user_email: err.message || "Failed to add participant." });
        } finally {
            setAddParticipantLoading(false);
        }
    };

    const handleRemoveParticipant = async (userId) => {
        const targetProjectId = getParticipantsProjectId();
        if (!targetProjectId || !participantsMeetingId) return;

        const confirmed = window.confirm("Remove this participant from the meeting?");
        if (!confirmed) return;

        try {
            await removeParticipant(targetProjectId, participantsMeetingId, userId);
            setParticipantsList((prev) => prev.filter((p) => p.user_id !== userId));
        } catch (err) {
            alert(err.message || "Failed to remove participant.");
        }
    };

    const handleChangeParticipantRole = async (userId, newRole) => {
        const targetProjectId = getParticipantsProjectId();
        if (!targetProjectId || !participantsMeetingId) return;

        try {
            await changeParticipantRole(targetProjectId, participantsMeetingId, userId, {
                role: newRole,
            });
            setParticipantsList((prev) =>
                prev.map((p) => (p.user_id === userId ? { ...p, role: newRole } : p))
            );
        } catch (err) {
            alert(err.message || "Failed to change participant role.");
        }
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
                                className="bg-transparent text-sm text-white/70 font-bold focus:outline-none placeholder:white/20 w-32 md:w-48"
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

                                            <div className="relative">
                                                <button
                                                    ref={(el) => { triggerRefs.current[meeting.id] = el; }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (openActionMenuId === meeting.id) {
                                                            setOpenActionMenuId(null);
                                                        } else {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setMenuPosition({
                                                                top: rect.bottom + 4,
                                                                left: Math.max(8, rect.right - 140),
                                                            });
                                                            setOpenActionMenuId(meeting.id);
                                                        }
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-white/[0.08] text-white/30 hover:text-white transition-colors"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {openActionMenuId && createPortal(
                <div
                    ref={actionMenuRef}
                    className="fixed z-[9999] min-w-[140px] rounded-xl border border-white/10 bg-[#141414] shadow-2xl overflow-hidden"
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                    <button
                        onClick={() => {
                            const meeting = meetings.find((m) => m.id === openActionMenuId);
                            if (meeting) openEditModal(meeting);
                        }}
                        className="w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-white/70 hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5"
                    >
                        <Edit size={13} /> Edit
                    </button>
                    <button
                        onClick={() => {
                            const meeting = meetings.find((m) => m.id === openActionMenuId);
                            if (meeting) openParticipantsModal(meeting);
                        }}
                        className="w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-white/70 hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5"
                    >
                        <Users size={13} /> Participants
                    </button>
                    <button
                        onClick={() => {
                            const meeting = meetings.find((m) => m.id === openActionMenuId);
                            if (meeting) handleDeleteMeeting(meeting);
                        }}
                        className="w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/[0.08] hover:text-red-300 flex items-center gap-2.5"
                    >
                        <Trash2 size={13} /> Delete
                    </button>
                </div>,
                document.body
            )}

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

            <Modal
                isOpen={editModalOpen}
                onClose={() => {
                    if (!editFormLoading) setEditModalOpen(false);
                }}
                title="Update Meeting"
                description="Edit the meeting details below."
                size="lg"
            >
                <Form
                    fields={EDIT_MEETING_FIELDS}
                    values={editFormValues}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                    errors={editServerErrors}
                    submitLabel="Update Meeting"
                    loading={editFormLoading}
                />
            </Modal>

            <Modal
                isOpen={participantsModalOpen}
                onClose={() => setParticipantsModalOpen(false)}
                title="Meeting Participants"
                description="Manage who has access to this meeting."
                size="lg"
            >
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                            {participantsLoading ? "Loading..." : `${participantsList.length} participant${participantsList.length !== 1 ? "s" : ""}`}
                        </p>
                        {!addParticipantFormOpen && (
                            <Button onClick={() => setAddParticipantFormOpen(true)} variant="secondary">
                                <Plus size={12} /> Add
                            </Button>
                        )}
                    </div>

                    {addParticipantFormOpen && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <Form
                                fields={ADD_PARTICIPANT_FIELDS}
                                values={addParticipantValues}
                                onChange={(key, val) =>
                                    setAddParticipantValues((prev) => ({ ...prev, [key]: val }))
                                }
                                onSubmit={handleAddParticipant}
                                errors={addParticipantErrors}
                                submitLabel="Add Participant"
                                loading={addParticipantLoading}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setAddParticipantFormOpen(false);
                                    setAddParticipantValues({ user_email: "", role: "viewer" });
                                    setAddParticipantErrors({});
                                }}
                                className="w-full mt-2 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors text-center"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {participantsError && (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-4 text-sm font-medium text-red-300">
                            {participantsError}
                        </div>
                    )}

                    {participantsLoading ? (
                        <div className="flex items-center justify-center py-12 text-white/40">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mr-3" />
                            <span className="text-xs font-bold uppercase tracking-widest">Loading participants...</span>
                        </div>
                    ) : participantsList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users size={32} className="text-white/15 mb-3" />
                            <p className="text-white/40 text-sm font-bold">No explicit participants</p>
                            <p className="text-white/25 text-xs mt-1">Add a participant to grant explicit access.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[360px] overflow-y-auto sidebar-scroll">
                            {participantsList.map((participant) => {
                                const roleMeta = getParticipantRoleMeta(participant.role);
                                return (
                                    <div
                                        key={participant.id}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-white/[0.06] border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Users size={16} className="text-white/50" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{participant.user_name}</p>
                                            <p className="text-xs text-white/35 truncate">{participant.user_email}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {["viewer", "commenter", "editor"].map((role) => {
                                                const isActive = participant.role === role;
                                                return (
                                                    <button
                                                        key={role}
                                                        type="button"
                                                        onClick={() => handleChangeParticipantRole(participant.user_id, role)}
                                                        className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all ${isActive
                                                            ? "bg-white/15 border-white/25 text-white"
                                                            : "bg-transparent border-white/5 text-white/25 hover:text-white/50 hover:border-white/15"
                                                            }`}
                                                    >
                                                        {role}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveParticipant(participant.user_id)}
                                            className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/[0.08] transition-colors flex-shrink-0"
                                            title="Remove participant"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
});

export default MeetingsTab;