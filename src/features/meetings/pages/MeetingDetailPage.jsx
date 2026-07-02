import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Clock,
    Edit,
    FileText,
    Globe,
    Hash,
    Info,
    Link as LinkIcon,
    Lock,
    MoreVertical,
    Play,
    Plus,
    Shield,
    Square,
    Trash2,
    Users,
} from "lucide-react";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Form from "@/components/Form";
import Modal from "@/components/Modal";
import TabBar from "@/components/TabBar";

import { getProjects, searchUsers } from "../../projects/api/projects";
import {
    getMeeting,
    listParticipants,
    updateMeeting,
    updateMeetingPolicy,
    startRecording,
    stopRecording,
    addParticipant,
    removeParticipant,
    changeParticipantRole,
} from "../api/meeting";

import {
    EDIT_MEETING_FIELDS,
    ADD_PARTICIPANT_ROLE_FIELDS,
    getStatusMeta,
    getVisibilityMeta,
    getParticipantRoleMeta,
    formatDateTime,
    toDateTimeLocalValue,
} from "../constants";

export default function MeetingDetailPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isSuperAdmin = useSelector((state) => state.auth.user?.is_super_admin === true);
    const currentUserId = useSelector((state) => state.auth.user?.id);

    const CAN_MANAGE_PARTICIPANTS = ["owner", "admin"];

    const [activeTab, setActiveTab] = useState("Info");
    const [projectId, setProjectId] = useState("");
    const [userRole, setUserRole] = useState("");
    const [meeting, setMeeting] = useState(null);
    const [participants, setParticipants] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false); // For Start/End buttons
    const [participantsLoading, setParticipantsLoading] = useState(false);
    const [participantsError, setParticipantsError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [serverErrors, setServerErrors] = useState({});

    const [addParticipantOpen, setAddParticipantOpen] = useState(false);
    const [addParticipantValues, setAddParticipantValues] = useState({ role: "viewer" });
    const [addParticipantLoading, setAddParticipantLoading] = useState(false);
    const [addParticipantErrors, setAddParticipantErrors] = useState({});

    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [userSearchLoading, setUserSearchLoading] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const userSearchRef = useRef(null);

    const [openActionId, setOpenActionId] = useState(null);
    const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false);
    const [changingUserId, setChangingUserId] = useState(null);
    const [changeRoleForm, setChangeRoleForm] = useState({ role: "viewer" });
    const [changeRoleLoading, setChangeRoleLoading] = useState(false);
    const [changeRoleError, setChangeRoleError] = useState("");

    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const projectIdFromNavigation = location.state?.projectId || searchParams.get("projectId") || "";
    const projectNameFromNavigation = location.state?.projectName || "";

    const tabs = [
        { id: "Info", label: "Details", icon: null },
        { id: "Participants", label: "Participants", icon: null },
        { id: "Transcript", label: "Transcript", icon: null },
        { id: "Tasks", label: "Action Items", icon: null },
    ];

    useEffect(() => {
        let mounted = true;

        async function loadMeetingDetails() {
            if (!id) {
                setError("Meeting id is missing.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");
            setParticipantsError("");

            try {
                let resolvedProjectId = projectIdFromNavigation;
                let resolvedProjectName = projectNameFromNavigation;
                let resolvedMeetingPreview = null;

                if (!resolvedProjectId) {
                    const projectsResponse = await getProjects();
                    const projects = Array.isArray(projectsResponse?.data) ? projectsResponse.data : [];

                    const results = await Promise.allSettled(
                        projects.map(async (project) => {
                            const response = await fetch(`/api/projects/${project.id}/meetings`);
                            const data = await response.json();
                            const meetings = Array.isArray(data?.meetings) ? data.meetings : [];
                            return {
                                project,
                                foundMeeting: meetings.find((meeting) => meeting.id === id) || null,
                            };
                        })
                    );

                    for (const result of results) {
                        if (result.status !== "fulfilled") continue;
                        if (!result.value.foundMeeting) continue;
                        resolvedProjectId = result.value.project.id;
                        resolvedProjectName = result.value.project.name;
                        resolvedMeetingPreview = result.value.foundMeeting;
                        setUserRole(result.value.project.user_role || "");
                        break;
                    }

                    if (!resolvedProjectId) {
                        throw new Error("Could not resolve the parent project for this meeting.");
                    }
                }

                const response = await getMeeting(resolvedProjectId, id);
                if (!mounted) return;

                const meetingData = response?.data ?? response;
                const nextMeeting = {
                    ...meetingData,
                    project_name: resolvedProjectName || resolvedMeetingPreview?.project_name || meetingData.project_name || "Project",
                };

                setProjectId(resolvedProjectId);
                setMeeting(nextMeeting);

                setParticipantsLoading(true);

                try {
                    const participantsResponse = await listParticipants(resolvedProjectId, id);
                    if (!mounted) return;
                    setParticipants(Array.isArray(participantsResponse?.data) ? participantsResponse.data : []);
                } catch (participantError) {
                    if (!mounted) return;
                    setParticipants([]);
                    setParticipantsError(participantError.message || "Failed to load participants.");
                } finally {
                    if (mounted) setParticipantsLoading(false);
                }
            } catch (fetchError) {
                if (!mounted) return;
                setError(fetchError.message || "Failed to load meeting.");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadMeetingDetails();
        return () => {
            mounted = false;
        };
    }, [id, projectIdFromNavigation, projectNameFromNavigation]);

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
                const existingIds = new Set(participants.map((p) => String(p.user_id)));
                setUserSearchResults(users.filter((u) => u.id && !existingIds.has(String(u.id)) && String(u.id) !== String(currentUserId)));
            } catch {
                setUserSearchResults([]);
            } finally {
                setUserSearchLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [userSearchQuery, selectedUser, participants, projectId, currentUserId]);

    useEffect(() => {
        if (!showUserDropdown) return;
        const handleClickOutside = (e) => {
            if (userSearchRef.current && !userSearchRef.current.contains(e.target)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showUserDropdown]);

    const uiStatus = useMemo(() => getStatusMeta(meeting?.status), [meeting?.status]);
    const hasFullPayload = useMemo(
        () => !!meeting && Object.prototype.hasOwnProperty.call(meeting, "access_policy"),
        [meeting]
    );
    const canAttemptEdit = hasFullPayload || isSuperAdmin;
    const canManageParticipants =
        isSuperAdmin ||
        CAN_MANAGE_PARTICIPANTS.includes(userRole) ||
        meeting?.created_by === currentUserId;
    const visibilityMeta = useMemo(
        () => getVisibilityMeta(meeting?.access_policy?.visibility),
        [meeting?.access_policy?.visibility]
    );
    const VisibilityIcon = visibilityMeta.icon;

    // --- Handlers for Start/End Meeting ---

    const handlestartRecording = async () => {
        if (!meeting || !projectId) return;
        setActionLoading(true);
        try {
            await startRecording(projectId, meeting.id);
            // API returns {}, so we refetch to get the updated status
            const response = await getMeeting(projectId, meeting.id);
            setMeeting(response?.data ?? response);
        } catch (err) {
            console.error("Failed to start meeting", err);
            alert("Failed to start recording. Please check permissions.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleEndMeeting = async () => {
        if (!meeting || !projectId) return;
        setActionLoading(true);
        try {
            await stopRecording(projectId, meeting.id);
            // API returns {}, so we refetch to get the updated status
            const response = await getMeeting(projectId, meeting.id);
            setMeeting(response?.data ?? response);
        } catch (err) {
            console.error("Failed to end meeting", err);
            alert("Failed to stop recording. Please check permissions.");
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = () => {
        if (!meeting) return;
        setFormValues({
            title: meeting.title ?? "",
            scheduled_at: toDateTimeLocalValue(meeting.scheduled_at),
            meeting_url: meeting.meeting_url ?? "",
            description: meeting.description ?? "",
            visibility: meeting.access_policy?.visibility ?? "public",
            gate_recording: meeting.access_policy?.gate_recording ?? false,
            gate_transcript: meeting.access_policy?.gate_transcript ?? false,
            gate_summary: meeting.access_policy?.gate_summary ?? false,
        });
        setServerErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
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

    const handleSubmit = async (values) => {
        if (!meeting || !projectId) return;

        setFormLoading(true);
        setServerErrors({});

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

            if (Object.keys(meetingPayload).length > 0) {
                const response = await updateMeeting(projectId, meeting.id, meetingPayload);
                const updatedMeeting = response?.data ?? response;
                setMeeting((prev) => ({ ...prev, ...updatedMeeting }));
            }

            if (Object.keys(policyPayload).length > 0) {
                const policyResponse = await updateMeetingPolicy(projectId, meeting.id, policyPayload);
                const updatedPolicy = policyResponse?.data ?? policyResponse;
                setMeeting((prev) => ({
                    ...prev,
                    access_policy: {
                        ...(prev.access_policy ?? {}),
                        ...updatedPolicy,
                    },
                }));
            }

            if (Object.keys(meetingPayload).length === 0 && Object.keys(policyPayload).length === 0) {
                setModalOpen(false);
                return;
            }

            setModalOpen(false);
        } catch (submitError) {
            setServerErrors({
                title: submitError.message || "Failed to update meeting.",
            });
        } finally {
            setFormLoading(false);
        }
    };

    const reloadParticipants = async () => {
        if (!projectId || !id) return;
        try {
            const participantsResponse = await listParticipants(projectId, id);
            setParticipants(Array.isArray(participantsResponse?.data) ? participantsResponse.data : []);
        } catch (err) {
            setParticipantsError(err.message || "Failed to load participants.");
        }
    };

    const handleAddParticipant = async (values) => {
        if (!selectedUser || !projectId || !id) {
            setAddParticipantErrors({ role: "Please select a user from the dropdown." });
            return;
        }

        setAddParticipantLoading(true);
        setAddParticipantErrors({});

        try {
            await addParticipant(projectId, id, {
                user_id: selectedUser.id,
                role: values.role,
            });
            closeAddParticipantModal();
            await reloadParticipants();
        } catch (err) {
            const msg =
                typeof err.message === "string"
                    ? err.message
                    : Array.isArray(err.detail)
                        ? err.detail.map((e) => e.msg || JSON.stringify(e)).join(", ")
                        : "Failed to add participant.";
            setAddParticipantErrors({ role: msg });
        } finally {
            setAddParticipantLoading(false);
        }
    };

    const openAddParticipantModal = () => {
        setAddParticipantValues({ role: "viewer" });
        setUserSearchQuery("");
        setSelectedUser(null);
        setUserSearchResults([]);
        setAddParticipantErrors({});
        setAddParticipantOpen(true);
    };

    const closeAddParticipantModal = () => {
        setAddParticipantOpen(false);
        setUserSearchQuery("");
        setSelectedUser(null);
        setUserSearchResults([]);
        setShowUserDropdown(false);
    };

    const handleRemoveParticipant = async (participant) => {
        if (!window.confirm(`Remove "${participant.user_name}" from this meeting?`)) return;
        try {
            await removeParticipant(projectId, id, participant.user_id);
            setParticipants((prev) => prev.filter((p) => p.user_id !== participant.user_id));
            setOpenActionId(null);
        } catch (err) {
            alert(err.message || "Failed to remove participant.");
        }
    };

    const handleChangeRole = async () => {
        setChangeRoleLoading(true);
        setChangeRoleError("");
        try {
            await changeParticipantRole(projectId, id, changingUserId, { role: changeRoleForm.role });
            setParticipants((prev) =>
                prev.map((p) => (p.user_id === changingUserId ? { ...p, role: changeRoleForm.role } : p))
            );
            setChangeRoleModalOpen(false);
            setOpenActionId(null);
        } catch (err) {
            setChangeRoleError(err.message || "Failed to change role.");
        } finally {
            setChangeRoleLoading(false);
        }
    };

    return (
        <>
            <div className="h-full flex flex-col animate-fade-in">
                <header className="mb-8 flex-shrink-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white"
                    >
                        <ArrowLeft size={14} /> Back to Meetings
                    </button>

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                                <h1 className="truncate text-xl font-black tracking-tight text-white">
                                    {loading ? "Loading..." : meeting?.title ?? "Meeting"}
                                </h1>
                                {!loading && !error && <Badge variant={uiStatus.variant}>{uiStatus.label}</Badge>}
                                {!loading && !error && (
                                    <Badge variant={visibilityMeta.variant} className="inline-flex items-center gap-1">
                                        <VisibilityIcon size={10} />
                                        {visibilityMeta.label}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 text-sm font-medium text-white/40 md:flex-row md:flex-wrap md:items-center md:gap-6">
                                <span className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    {formatDateTime(meeting?.scheduled_at)}
                                </span>
                                {meeting?.project_name && (
                                    <span className="flex items-center gap-2 text-white/50">
                                        <Hash size={14} />
                                        {meeting.project_name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {activeTab === "Info" && (
                                <>
                                    {meeting?.status === 'scheduled' && (
                                        <Button
                                            onClick={handlestartRecording}
                                            disabled={loading || !!error || actionLoading}
                                        >
                                            <Play size={14} fill="currentColor" /> Start Meeting
                                        </Button>
                                    )}

                                    {meeting?.status === 'live' && (
                                        <Button
                                            variant="secondary"
                                            onClick={handleEndMeeting}
                                            disabled={loading || !!error || actionLoading}
                                        >
                                            <Square size={14} fill="currentColor" /> End Meeting
                                        </Button>
                                    )}

                                    <Button onClick={openEditModal} disabled={loading || !!error || !canAttemptEdit}>
                                        <Edit size={14} /> Edit Meeting
                                    </Button>
                                </>
                            )}
                            {activeTab === "Participants" && canManageParticipants && (
                                <Button onClick={openAddParticipantModal} disabled={loading || !!error}>
                                    <Plus size={14} /> Add Participant
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                {!loading && !error && !hasFullPayload && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.08] p-4 text-amber-200">
                        <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold">Restricted meeting view</p>
                            <p className="mt-1 text-xs text-amber-200/75">
                                You can see metadata for this meeting, but protected artifacts are hidden unless you are an admin, creator, or participant.
                            </p>
                        </div>
                    </div>
                )}

                <div className="mb-6 flex-shrink-0">
                    <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="flex-1 overflow-y-auto rounded-[30px] border border-white/[0.1] bg-white/[0.03] p-5 transition-colors min-h-0">
                    {loading ? (
                        <div className="flex h-full items-center justify-center text-white/40 font-bold">
                            Loading meeting details...
                        </div>
                    ) : error ? (
                        <div className="flex h-full items-center justify-center text-red-400 font-bold">
                            {error}
                        </div>
                    ) : (
                        <>
                            {activeTab === "Info" && (
                                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                                    <div className="space-y-5">
                                        <Card className="border-white/5 bg-white/[0.02] p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                                    <Info size={18} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Description</p>
                                                    <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                                                        {meeting?.description || (
                                                            <span className="italic text-white/30">
                                                                No description or agenda has been added for this meeting yet.
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <Card className="border-white/5 bg-white/[0.02] p-5">
                                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Meeting URL</p>
                                                {meeting?.meeting_url ? (
                                                    <a
                                                        href={meeting.meeting_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-3 inline-flex items-center gap-2 break-all text-sm font-medium text-white/80 underline decoration-white/20 underline-offset-4 hover:text-white"
                                                    >
                                                        <LinkIcon size={14} />
                                                        {meeting.meeting_url}
                                                    </a>
                                                ) : (
                                                    <p className="mt-3 text-sm text-white/35">No meeting URL attached.</p>
                                                )}
                                            </Card>

                                            <Card className="border-white/5 bg-white/[0.02] p-5">
                                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Access Level</p>
                                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                                    <Badge variant={hasFullPayload ? "success" : "medium"}>
                                                        {hasFullPayload ? "Full details" : "Metadata only"}
                                                    </Badge>
                                                    {!hasFullPayload && <Badge variant="default">Restricted artifacts</Badge>}
                                                </div>
                                            </Card>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <Card className="border-white/5 bg-white/[0.02] p-5">
                                            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Metadata</p>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <Calendar size={16} className="mt-0.5 text-blue-400" />
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-white/30">Scheduled</p>
                                                        <p className="mt-1 text-sm text-white/80">{formatDateTime(meeting?.scheduled_at)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Clock size={16} className="mt-0.5 text-violet-400" />
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-white/30">Ended</p>
                                                        <p className="mt-1 text-sm text-white/80">
                                                            {formatDateTime(meeting?.ended_at, "Still active or not ended")}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Hash size={16} className="mt-0.5 text-white/40" />
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-white/30">Meeting ID</p>
                                                        <p className="mt-1 break-all font-mono text-xs text-white/65">{meeting?.id}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="border-white/5 bg-white/[0.02] p-5">
                                            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Visibility Policy</p>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant={visibilityMeta.variant} className="inline-flex items-center gap-1">
                                                    <VisibilityIcon size={10} />
                                                    {visibilityMeta.label}
                                                </Badge>
                                                {meeting?.access_policy?.gate_recording && <Badge variant="default">Recording gated</Badge>}
                                                {meeting?.access_policy?.gate_transcript && <Badge variant="default">Transcript gated</Badge>}
                                                {meeting?.access_policy?.gate_summary && <Badge variant="default">Summary gated</Badge>}
                                            </div>

                                            <p className="mt-4 text-sm leading-relaxed text-white/55">
                                                {meeting?.access_policy?.visibility === "private"
                                                    ? "Only the creator, explicit participants, and project admins can discover this meeting."
                                                    : meeting?.access_policy?.visibility === "restricted"
                                                        ? "All project members can see the meeting, but artifact access depends on the active gates."
                                                        : "All project members can open this meeting and its artifacts."}
                                            </p>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Participants" && (
                                <div className="animate-fade-in flex flex-col min-h-0">
                                    {!participantsLoading && !participantsError && (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">
                                            {participants.length} participant{participants.length !== 1 ? "s" : ""}
                                        </p>
                                    )}

                                    {participantsError && (
                                        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-4 text-sm font-medium text-red-300 mb-4">
                                            {participantsError}
                                        </div>
                                    )}

                                    {participantsLoading ? (
                                        <div className="flex min-h-[240px] items-center justify-center text-white/35">
                                            Loading participants...
                                        </div>
                                    ) : participants.length === 0 ? (
                                        <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                                            <Users size={38} className="mb-4 text-white/20" />
                                            <h3 className="text-white font-bold">No explicit participants</h3>
                                            <p className="mt-1 max-w-sm text-sm text-white/30">
                                                This meeting does not currently have any active participant records attached to it.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] flex-1 min-h-0">
                                            <table className="w-full text-sm text-left border-collapse">
                                                <thead className="text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/[0.08] sticky top-0 bg-[#0A0A0A] z-10">
                                                    <tr>
                                                        <th className="px-5 py-4">Participant</th>
                                                        <th className="px-5 py-4">Role</th>
                                                        <th className="px-5 py-4">Status</th>
                                                        <th className="px-5 py-4">Invited</th>
                                                        {canManageParticipants && (
                                                            <th className="px-5 py-4 text-right">Actions</th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/[0.05]">
                                                    {participants.map((participant) => {
                                                        const roleMeta = getParticipantRoleMeta(participant.role);
                                                        return (
                                                            <tr
                                                                key={participant.id}
                                                                className="hover:bg-white/[0.04] transition-colors group"
                                                            >
                                                                <td className="px-5 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-sm font-bold text-white group-hover:scale-105 transition-transform duration-300">
                                                                            {participant.user_name?.charAt(0)?.toUpperCase() || "?"}
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-bold text-white tracking-tight text-sm">
                                                                                {participant.user_name}
                                                                            </div>
                                                                            <div className="text-xs text-white/40 font-medium">
                                                                                {participant.user_email}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <Badge variant={roleMeta.variant}>{roleMeta.label}</Badge>
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <Badge variant={participant.is_active ? "success" : "high"}>
                                                                        {participant.is_active ? "Active" : "Inactive"}
                                                                    </Badge>
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <span className="text-xs text-white/50">
                                                                        {formatDateTime(participant.invited_at, "Unknown")}
                                                                    </span>
                                                                </td>
                                                                {canManageParticipants && (
                                                                    <td className="px-5 py-4 text-right">
                                                                        <ActionMenu
                                                                            open={openActionId === participant.user_id}
                                                                            onToggle={() => {
                                                                                setOpenActionId((curr) => (curr === participant.user_id ? null : participant.user_id));
                                                                            }}
                                                                            onChangeRole={() => {
                                                                                setChangingUserId(participant.user_id);
                                                                                setChangeRoleForm({ role: participant.role });
                                                                                setChangeRoleError("");
                                                                                setChangeRoleModalOpen(true);
                                                                                setOpenActionId(null);
                                                                            }}
                                                                            onRemove={() => {
                                                                                handleRemoveParticipant(participant);
                                                                                setOpenActionId(null);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "Transcript" && (
                                <div className="flex min-h-[280px] flex-col items-center justify-center text-center text-white/25">
                                    <FileText size={44} className="mb-4 opacity-60" />
                                    <p className="text-base font-bold text-white/45">Transcript UI not wired yet</p>
                                    <p className="mt-2 max-w-md text-sm text-white/25">
                                        The detail endpoint is integrated, but transcript-specific frontend sections still need to be implemented.
                                    </p>
                                </div>
                            )}

                            {activeTab === "Tasks" && (
                                <div className="flex min-h-[280px] flex-col items-center justify-center text-center text-white/25">
                                    <Clock size={44} className="mb-4 opacity-60" />
                                    <p className="text-base font-bold text-white/45">Action item UI not wired yet</p>
                                    <p className="mt-2 max-w-md text-sm text-white/25">
                                        Meeting metadata and participants are now live. Action item sections can be connected later.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title="Update Meeting"
                description="Edit the meeting details below."
                size="lg"
            >
                <Form
                    fields={EDIT_MEETING_FIELDS}
                    values={formValues}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    errors={serverErrors}
                    submitLabel="Update Meeting"
                    loading={formLoading}
                />
            </Modal>

            <Modal
                isOpen={addParticipantOpen}
                onClose={closeAddParticipantModal}
                title="Add Participant"
                description="Search for a user to add them to this meeting."
            >
                <div className="space-y-5">
                    <div className="space-y-1.5" ref={userSearchRef}>
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
                                    if (selectedUser) {
                                        setSelectedUser(null);
                                        setAddParticipantErrors({});
                                    }
                                }}
                                placeholder="Type name or email..."
                                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.3] focus:bg-white/[0.08] transition-all"
                            />
                            {userSearchLoading && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                                </div>
                            )}
                            {showUserDropdown && userSearchResults.length > 0 && (
                                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#1A1A1A] border border-white/10 rounded-xl overflow-y-auto max-h-48 z-[9999] shadow-2xl py-1.5">
                                    {userSearchResults.map((u) => (
                                        <div
                                            key={u.id}
                                            onClick={() => {
                                                setSelectedUser(u);
                                                setUserSearchQuery(`${u.full_name} (${u.email})`);
                                                setShowUserDropdown(false);
                                                setAddParticipantErrors({});
                                            }}
                                            className="px-4 py-2.5 hover:bg-white/10 cursor-pointer transition-colors flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                                {u.full_name?.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold text-white truncate">{u.full_name}</div>
                                                <div className="text-[10px] text-white/40 font-medium truncate">{u.email}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {selectedUser && (
                            <div className="flex items-center gap-3 p-3 bg-white/[0.05] border border-white/10 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 flex-shrink-0">
                                    {selectedUser.full_name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white truncate">{selectedUser.full_name}</div>
                                    <div className="text-[10px] text-white/40 font-medium truncate">{selectedUser.email}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Form
                        fields={ADD_PARTICIPANT_ROLE_FIELDS}
                        values={addParticipantValues}
                        onChange={(key, val) =>
                            setAddParticipantValues((prev) => ({ ...prev, [key]: val }))
                        }
                        onSubmit={handleAddParticipant}
                        errors={addParticipantErrors}
                        submitLabel="Add Participant"
                        loading={addParticipantLoading}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={changeRoleModalOpen}
                onClose={() => setChangeRoleModalOpen(false)}
                title="Change Participant Role"
                description="Update the role for this participant."
            >
                {changeRoleError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-xs text-red-400 font-bold">{changeRoleError}</p>
                    </div>
                )}
                <Form
                    fields={ADD_PARTICIPANT_ROLE_FIELDS}
                    values={changeRoleForm}
                    onChange={(key, val) => setChangeRoleForm((prev) => ({ ...prev, [key]: val }))}
                    onSubmit={handleChangeRole}
                    errors={changeRoleError ? { role: changeRoleError } : {}}
                    submitLabel="Update Role"
                    loading={changeRoleLoading}
                />
            </Modal>
        </>
    );
}

function ActionMenu({ open, onToggle, onChangeRole, onRemove }) {
    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const [menuStyle, setMenuStyle] = useState({});

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setMenuStyle({
            position: "fixed",
            right: window.innerWidth - rect.right,
            top: rect.bottom + 6,
            zIndex: 9999,
        });
    }, []);

    useEffect(() => {
        if (!open) return;
        updatePosition();
        const close = (e) => {
            if (
                triggerRef.current && triggerRef.current.contains(e.target)
            ) return;
            if (
                menuRef.current && menuRef.current.contains(e.target)
            ) return;
            onToggle();
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open, onToggle, updatePosition]);

    const menu = open && ReactDOM.createPortal(
        <div ref={menuRef} style={menuStyle} className="min-w-[160px] rounded-xl border border-white/10 bg-[#141414] shadow-2xl overflow-hidden">
            <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onChangeRole}
                className="w-full px-3 py-2 text-left text-[11px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/[0.05] hover:text-white flex items-center gap-2.5"
            >
                <Shield size={13} /> Change Role
            </button>
            <div className="border-t border-white/[0.06]" />
            <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onRemove}
                className="w-full px-3 py-2 text-left text-[11px] font-bold uppercase tracking-widest text-red-400/70 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-2.5"
            >
                <Trash2 size={13} /> Remove
            </button>
        </div>,
        document.body
    );

    return (
        <>
            <button
                ref={triggerRef}
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors"
            >
                <MoreVertical size={15} />
            </button>
            {menu}
        </>
    );
}