const KEY = "dummy_db";
const SEED_VERSION = 4; // bump whenever seed() below changes shape/content

function allTrue() {
    return {
        can_view_meetings: true,
        can_create_meetings: true,
        can_edit_meetings: true,
        can_delete_meetings: true,
        can_manage_members: true,
        can_view_recordings: true,
        can_view_transcripts: true,
        can_view_summaries: true,
        can_chat_with_ai: true,
    };
}

function membersFor(users, projectId, ownerId = "u1") {
    return users.map((u) => ({
        id: `m-${projectId}-${u.id}`,
        user_id: u.id,
        user_name: u.full_name,
        user_email: u.email,
        role: u.id === ownerId ? "owner" : "member",
        is_active: true,
        invited_at: u.created_at,
        permissions: allTrue(),
        user_override: null,
    }));
}

function seed() {
    const users = [
            { id: "u1", full_name: "Demo User", email: "demo@meetai.com", is_active: true, is_super_admin: true, project_count: 3, created_at: "2026-01-10T09:00:00Z", deleted_at: null },
            { id: "u2", full_name: "Ava Patel", email: "ava@meetai.com", is_active: true, is_super_admin: false, project_count: 2, created_at: "2026-02-01T09:00:00Z", deleted_at: null },
            { id: "u3", full_name: "Liam Chen", email: "liam@meetai.com", is_active: false, is_super_admin: false, project_count: 1, created_at: "2026-02-15T09:00:00Z", deleted_at: null },
            { id: "u4", full_name: "Sofia Rossi", email: "sofia@meetai.com", is_active: true, is_super_admin: false, project_count: 2, created_at: "2026-02-20T09:00:00Z", deleted_at: null },
            { id: "u5", full_name: "Noah Kim", email: "noah@meetai.com", is_active: true, is_super_admin: false, project_count: 1, created_at: "2026-03-05T09:00:00Z", deleted_at: null },
            { id: "u6", full_name: "Maya Singh", email: "maya@meetai.com", is_active: true, is_super_admin: false, project_count: 1, created_at: "2026-03-18T09:00:00Z", deleted_at: null },
            { id: "u7", full_name: "Ethan Brooks", email: "ethan@meetai.com", is_active: true, is_super_admin: false, project_count: 1, created_at: "2026-03-22T09:00:00Z", deleted_at: null },
            { id: "u8", full_name: "Priya Nair", email: "priya@meetai.com", is_active: true, is_super_admin: false, project_count: 0, created_at: "2026-04-02T09:00:00Z", deleted_at: null },
            { id: "u9", full_name: "Marcus Lee", email: "marcus@meetai.com", is_active: false, is_super_admin: false, project_count: 0, created_at: "2026-04-10T09:00:00Z", deleted_at: null },
            { id: "u10", full_name: "Grace Oyelaran", email: "grace@meetai.com", is_active: true, is_super_admin: false, project_count: 1, created_at: "2026-04-15T09:00:00Z", deleted_at: null },
        { id: "u11", full_name: "Daniel Kowalski", email: "daniel@meetai.com", is_active: true, is_super_admin: false, project_count: 0, created_at: "2026-04-20T09:00:00Z", deleted_at: null },
    ];

    return {
        __v: SEED_VERSION,
        session: null,
        users,
        projects: [
            { id: "p1", name: "Product Launch", description: "Q3 launch plan", short_description: "Q3 launch", status: "in_progress", deadline: "2026-09-01", user_role: "owner", is_active: true },
            { id: "p2", name: "Website Revamp", description: "Marketing site redesign", short_description: "Site redesign", status: "not_started", deadline: "2026-08-15", user_role: "admin", is_active: true },
            { id: "p3", name: "Mobile App v2", description: "Native app rewrite", short_description: "App rewrite", status: "in_progress", deadline: "2026-10-20", user_role: "owner", is_active: true },
            { id: "p4", name: "Customer Onboarding", description: "Self-serve onboarding flow", short_description: "Onboarding flow", status: "on_hold", deadline: "2026-07-30", user_role: "member", is_active: true },
            { id: "p5", name: "Internal Tools Cleanup", description: "Retire legacy admin panel", short_description: "Legacy cleanup", status: "completed", deadline: "2026-05-01", user_role: "admin", is_active: true },
        ],
        members: {
            p1: membersFor(users, "p1"),
            p2: membersFor(users, "p2"),
            p3: membersFor(users, "p3"),
            p4: membersFor(users, "p4"),
            p5: membersFor(users, "p5"),
        },
        meetings: {
            p1: [
                { id: "mt1", title: "Kickoff Sync", description: "Initial planning", scheduled_at: "2026-07-10T15:00:00Z", meeting_url: "https://meet.meetai.com/mt1", status: "scheduled", project_id: "p1", project_name: "Product Launch", created_by: "u1", ended_at: null, created_at: "2026-07-01T09:00:00Z", access_policy: { visibility: "restricted", gate_recording: false, gate_transcript: false, gate_summary: false }, access_level: "full_details" },
                { id: "mt2", title: "Launch Readiness Review", description: "Go/no-go checklist walkthrough", scheduled_at: "2026-07-05T10:00:00Z", meeting_url: "https://meet.meetai.com/mt2", status: "ready", project_id: "p1", project_name: "Product Launch", created_by: "u1", ended_at: "2026-07-05T11:00:00Z", created_at: "2026-06-28T09:00:00Z", access_policy: { visibility: "public", gate_recording: false, gate_transcript: true, gate_summary: false }, access_level: "full_details" },
                { id: "mt10", title: "Marketing Sync", description: "Launch campaign coordination", scheduled_at: "2026-07-20T14:00:00Z", meeting_url: "https://meet.meetai.com/mt10", status: "scheduled", project_id: "p1", project_name: "Product Launch", created_by: "u1", ended_at: null, created_at: "2026-07-04T09:00:00Z", access_policy: { visibility: "restricted", gate_recording: false, gate_transcript: false, gate_summary: false }, access_level: "full_details" },
                { id: "mt11", title: "Beta Feedback Review", description: "Triage beta tester feedback", scheduled_at: "2026-06-20T10:00:00Z", meeting_url: "https://meet.meetai.com/mt11", status: "ready", project_id: "p1", project_name: "Product Launch", created_by: "u1", ended_at: "2026-06-20T11:00:00Z", created_at: "2026-06-15T09:00:00Z", access_policy: { visibility: "public", gate_recording: true, gate_transcript: true, gate_summary: false }, access_level: "full_details" },
            ],
            p2: [
                { id: "mt3", title: "Design Review", description: "Homepage mockup feedback", scheduled_at: "2026-07-15T13:00:00Z", meeting_url: "https://meet.meetai.com/mt3", status: "scheduled", project_id: "p2", project_name: "Website Revamp", created_by: "u1", ended_at: null, created_at: "2026-07-02T09:00:00Z", access_policy: { visibility: "restricted", gate_recording: false, gate_transcript: false, gate_summary: false }, access_level: "full_details" },
                { id: "mt7", title: "Copy & SEO Sync", description: "Landing page copy review", scheduled_at: "2026-07-18T11:00:00Z", meeting_url: "https://meet.meetai.com/mt7", status: "scheduled", project_id: "p2", project_name: "Website Revamp", created_by: "u1", ended_at: null, created_at: "2026-07-03T09:00:00Z", access_policy: { visibility: "restricted", gate_recording: false, gate_transcript: false, gate_summary: false }, access_level: "full_details" },
            ],
            p3: [
                { id: "mt4", title: "Sprint Planning", description: "v2 sprint 3 planning", scheduled_at: "2026-06-30T09:00:00Z", meeting_url: "https://meet.meetai.com/mt4", status: "processing", project_id: "p3", project_name: "Mobile App v2", created_by: "u1", ended_at: "2026-06-30T10:00:00Z", created_at: "2026-06-25T09:00:00Z", access_policy: { visibility: "private", gate_recording: true, gate_transcript: true, gate_summary: true }, access_level: "metadata_only" },
                { id: "mt5", title: "API Contract Review", description: "Backend/mobile handoff", scheduled_at: "2026-07-08T16:00:00Z", meeting_url: "https://meet.meetai.com/mt5", status: "scheduled", project_id: "p3", project_name: "Mobile App v2", created_by: "u1", ended_at: null, created_at: "2026-07-01T09:00:00Z", access_policy: { visibility: "restricted", gate_recording: false, gate_transcript: false, gate_summary: false }, access_level: "full_details" },
                { id: "mt12", title: "QA Bug Triage", description: "Weekly bug review", scheduled_at: "2026-07-11T09:00:00Z", meeting_url: "https://meet.meetai.com/mt12", status: "scheduled", project_id: "p3", project_name: "Mobile App v2", created_by: "u1", ended_at: null, created_at: "2026-07-04T09:00:00Z", access_policy: { visibility: "restricted", gate_recording: false, gate_transcript: false, gate_summary: false }, access_level: "full_details" },
            ],
            p4: [
                { id: "mt8", title: "Onboarding Flow Walkthrough", description: "Review self-serve signup steps", scheduled_at: "2026-07-12T09:30:00Z", meeting_url: "https://meet.meetai.com/mt8", status: "scheduled", project_id: "p4", project_name: "Customer Onboarding", created_by: "u1", ended_at: null, created_at: "2026-07-01T09:00:00Z", access_policy: { visibility: "restricted", gate_recording: false, gate_transcript: false, gate_summary: false }, access_level: "full_details" },
            ],
            p5: [
                { id: "mt6", title: "Legacy Panel Retro", description: "Post-mortem on the cleanup", scheduled_at: "2026-05-01T14:00:00Z", meeting_url: "https://meet.meetai.com/mt6", status: "ready", project_id: "p5", project_name: "Internal Tools Cleanup", created_by: "u1", ended_at: "2026-05-01T15:00:00Z", created_at: "2026-04-28T09:00:00Z", access_policy: { visibility: "public", gate_recording: false, gate_transcript: false, gate_summary: false }, access_level: "full_details" },
                { id: "mt9", title: "Handoff to Support Team", description: "Knowledge transfer session", scheduled_at: "2026-05-03T10:00:00Z", meeting_url: "https://meet.meetai.com/mt9", status: "ready", project_id: "p5", project_name: "Internal Tools Cleanup", created_by: "u1", ended_at: "2026-05-03T11:00:00Z", created_at: "2026-04-29T09:00:00Z", access_policy: { visibility: "public", gate_recording: false, gate_transcript: true, gate_summary: true }, access_level: "full_details" },
            ],
        },
        participants: {
            mt1: [
                { id: "pt1", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-07-01T09:00:00Z" },
                { id: "pt2", user_id: "u2", user_name: "Ava Patel", user_email: "ava@meetai.com", role: "editor", is_active: true, invited_at: "2026-07-01T09:05:00Z" },
            ],
            mt2: [
                { id: "pt3", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-06-28T09:00:00Z" },
                { id: "pt4", user_id: "u4", user_name: "Sofia Rossi", user_email: "sofia@meetai.com", role: "commenter", is_active: true, invited_at: "2026-06-28T09:10:00Z" },
            ],
            mt3: [
                { id: "pt5", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-07-02T09:00:00Z" },
                { id: "pt6", user_id: "u5", user_name: "Noah Kim", user_email: "noah@meetai.com", role: "editor", is_active: true, invited_at: "2026-07-02T09:05:00Z" },
            ],
            mt4: [
                { id: "pt7", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-06-25T09:00:00Z" },
                { id: "pt8", user_id: "u6", user_name: "Maya Singh", user_email: "maya@meetai.com", role: "viewer", is_active: true, invited_at: "2026-06-25T09:10:00Z" },
            ],
            mt5: [
                { id: "pt9", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-07-01T09:00:00Z" },
                { id: "pt10", user_id: "u2", user_name: "Ava Patel", user_email: "ava@meetai.com", role: "editor", is_active: true, invited_at: "2026-07-01T09:05:00Z" },
            ],
            mt6: [
                { id: "pt11", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-04-28T09:00:00Z" },
            ],
            mt7: [
                { id: "pt12", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-07-03T09:00:00Z" },
                { id: "pt13", user_id: "u5", user_name: "Noah Kim", user_email: "noah@meetai.com", role: "commenter", is_active: true, invited_at: "2026-07-03T09:05:00Z" },
            ],
            mt8: [
                { id: "pt14", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-07-01T09:00:00Z" },
            ],
            mt9: [
                { id: "pt15", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-04-29T09:00:00Z" },
                { id: "pt16", user_id: "u4", user_name: "Sofia Rossi", user_email: "sofia@meetai.com", role: "viewer", is_active: true, invited_at: "2026-04-29T09:05:00Z" },
            ],
            mt10: [
                { id: "pt17", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-07-04T09:00:00Z" },
                { id: "pt18", user_id: "u2", user_name: "Ava Patel", user_email: "ava@meetai.com", role: "editor", is_active: true, invited_at: "2026-07-04T09:05:00Z" },
            ],
            mt11: [
                { id: "pt19", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-06-15T09:00:00Z" },
                { id: "pt20", user_id: "u7", user_name: "Ethan Brooks", user_email: "ethan@meetai.com", role: "viewer", is_active: true, invited_at: "2026-06-15T09:05:00Z" },
            ],
            mt12: [
                { id: "pt21", user_id: "u1", user_name: "Demo User", user_email: "demo@meetai.com", role: "owner", is_active: true, invited_at: "2026-07-04T09:00:00Z" },
                { id: "pt22", user_id: "u2", user_name: "Ava Patel", user_email: "ava@meetai.com", role: "editor", is_active: true, invited_at: "2026-07-04T09:05:00Z" },
            ],
        },
    };
}

export function getDB() {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && parsed.__v === SEED_VERSION) return parsed;
    const db = seed();
    saveDB(db);
    return db;
}

export function saveDB(db) {
    localStorage.setItem(KEY, JSON.stringify(db));
}

export function resetSession() {
    const db = getDB();
    db.session = null;
    saveDB(db);
}
