import React, { useEffect, useMemo, useState } from "react";
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
    Play, // Added for Start button
    Shield,
    Square, // Added for End button
    Users,
} from "lucide-react";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Form from "@/components/Form";
import Modal from "@/components/Modal";
import TabBar from "@/components/TabBar";

import { getProjects } from "../../projects/api/projects";
import {
    getMeeting,
    listParticipants,
    updateMeeting,
    updateMeetingPolicy,
    startRecording, // Added API function
    stopRecording,  // Added API function
} from "../api/meeting";

import {
    EDIT_MEETING_FIELDS,
    getStatusMeta,
    getVisibilityMeta,
    getParticipantRoleMeta,
    formatDateTime,
    toDateTimeLocalValue,
    resolveMeetingProject
} from "../constants";

export default function MeetingDetailPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const isSuperAdmin = useSelector((state) => state.auth.user?.is_super_admin === true);

    const [activeTab, setActiveTab] = useState("Info");
    const [projectId, setProjectId] = useState("");
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

    const uiStatus = useMemo(() => getStatusMeta(meeting?.status), [meeting?.status]);
    const hasFullPayload = useMemo(
        () => !!meeting && Object.prototype.hasOwnProperty.call(meeting, "access_policy"),
        [meeting]
    );
    const canAttemptEdit = hasFullPayload || isSuperAdmin;
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
                                <h1 className="truncate text-3xl font-black tracking-tight text-white">
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
                                    {/* Show Start Button if Status is scheduled */}
                                    {meeting?.status === 'scheduled' && (
                                        <Button
                                            onClick={handlestartRecording}
                                            disabled={loading || !!error || actionLoading}
                                        >
                                            <Play size={14} fill="currentColor" /> Start Meeting
                                        </Button>
                                    )}

                                    {/* Show End Button if Status is live */}
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
                                <div className="space-y-4 animate-fade-in">
                                    {participantsError && (
                                        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.08] p-4 text-sm font-medium text-red-300">
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
                                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                            {participants.map((participant) => {
                                                const roleMeta = getParticipantRoleMeta(participant.role);

                                                return (
                                                    <Card
                                                        key={participant.id}
                                                        className="border-white/5 bg-white/[0.02] p-5"
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0">
                                                                <h3 className="truncate text-base font-black tracking-tight text-white">
                                                                    {participant.user_name}
                                                                </h3>
                                                                <p className="mt-1 truncate text-sm text-white/45">
                                                                    {participant.user_email}
                                                                </p>
                                                            </div>

                                                            <Badge variant={roleMeta.variant}>{roleMeta.label}</Badge>
                                                        </div>

                                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                                            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                                                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Invited</p>
                                                                <p className="mt-2 text-xs text-white/75">{formatDateTime(participant.invited_at, "Unknown")}</p>
                                                            </div>

                                                            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                                                                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Status</p>
                                                                <p className="mt-2 text-xs text-white/75">
                                                                    {participant.is_active ? "Active participant" : "Inactive"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
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
        </>
    );
}