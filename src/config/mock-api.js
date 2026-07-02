import { getDB, saveDB } from "./dummy-db";

function seg(endpoint) {
    const [path] = endpoint.split("?");
    return path.replace(/^\//, "").split("/");
}

function qs(endpoint) {
    return new URLSearchParams(endpoint.split("?")[1] || "");
}

function find(list, id) {
    return (list || []).find((item) => item.id === id);
}

const routes = [
    ["POST", /^auth\/login$/, () => {
        const db = getDB();
        const user = db.users.find((u) => u.id === "u1"); // demo account is always u1
        db.session = { ...user, name: user.full_name, role: user.is_super_admin ? "Admin" : "Member", avatar: null };
        saveDB(db);
        return {};
    }],
    ["GET", /^auth\/me$/, () => {
        const db = getDB();
        if (!db.session) throw new Error("Not authenticated");
        return { data: db.session };
    }],

    // ── Projects ─────────────────────────────────────────────
    ["GET", /^projects$/, (m, body, endpoint) => {
        const db = getDB();
        const q = qs(endpoint);
        let list = db.projects;
        if (q.get("deleted_only") === "true") list = list.filter((p) => !p.is_active);
        else if (q.get("include_deleted") !== "true") list = list.filter((p) => p.is_active);
        if (q.get("role")) list = list.filter((p) => p.user_role === q.get("role"));
        return { data: list };
    }],
    ["POST", /^projects$/, (m, body) => {
        const db = getDB();
        const project = { id: crypto.randomUUID(), is_active: true, user_role: "owner", status: "not_started", ...body };
        db.projects.push(project);
        db.members[project.id] = [];
        db.meetings[project.id] = [];
        saveDB(db);
        return { data: project };
    }],
    ["GET", /^projects\/([^/]+)$/, ([id]) => {
        const db = getDB();
        return { data: find(db.projects, id) };
    }],
    ["PATCH", /^projects\/([^/]+)$/, ([id], body) => {
        const db = getDB();
        Object.assign(find(db.projects, id), body);
        saveDB(db);
        return { data: find(db.projects, id) };
    }],
    ["DELETE", /^projects\/([^/]+)$/, ([id]) => {
        const db = getDB();
        find(db.projects, id).is_active = false;
        saveDB(db);
        return {};
    }],
    ["PATCH", /^projects\/([^/]+)\/reactivate$/, ([id]) => {
        const db = getDB();
        find(db.projects, id).is_active = true;
        saveDB(db);
        return { data: find(db.projects, id) };
    }],

    // ── Project members ──────────────────────────────────────
    ["GET", /^projects\/([^/]+)\/members$/, ([pid]) => {
        const db = getDB();
        return { data: db.members[pid] || [] };
    }],
    ["POST", /^projects\/([^/]+)\/members$/, ([pid], body) => {
        const db = getDB();
        const member = { id: crypto.randomUUID(), role: "member", is_active: true, invited_at: new Date().toISOString(), permissions: {}, user_override: null, ...body };
        db.members[pid] = db.members[pid] || [];
        db.members[pid].push(member);
        saveDB(db);
        return { data: member };
    }],
    ["PATCH", /^projects\/([^/]+)\/members\/([^/]+)$/, ([pid, uid], body) => {
        const db = getDB();
        const member = (db.members[pid] || []).find((m) => m.user_id === uid);
        Object.assign(member, body);
        saveDB(db);
        return { data: member };
    }],
    ["DELETE", /^projects\/([^/]+)\/members\/([^/]+)$/, ([pid, uid]) => {
        const db = getDB();
        db.members[pid] = (db.members[pid] || []).filter((m) => m.user_id !== uid);
        saveDB(db);
        return {};
    }],
    ["GET", /^projects\/([^/]+)\/members\/([^/]+)\/permissions$/, ([pid, uid]) => {
        const db = getDB();
        const member = (db.members[pid] || []).find((m) => m.user_id === uid);
        return { data: member?.permissions || {} };
    }],

    // ── Meetings ──────────────────────────────────────────────
    ["GET", /^projects\/([^/]+)\/meetings$/, ([pid]) => {
        const db = getDB();
        return { data: { meetings: db.meetings[pid] || [], project_name: find(db.projects, pid)?.name } };
    }],
    ["POST", /^projects\/([^/]+)\/meetings$/, ([pid], body) => {
        const db = getDB();
        const meeting = {
            id: crypto.randomUUID(),
            project_id: pid,
            project_name: find(db.projects, pid)?.name,
            status: "scheduled",
            created_by: db.session?.id || "u1",
            ended_at: null,
            created_at: new Date().toISOString(),
            access_policy: { visibility: "restricted", gate_recording: false, gate_transcript: false, gate_summary: false },
            access_level: "full_details",
            ...body,
        };
        db.meetings[pid] = db.meetings[pid] || [];
        db.meetings[pid].push(meeting);
        saveDB(db);
        return { data: meeting };
    }],
    ["GET", /^projects\/([^/]+)\/meetings\/([^/]+)$/, ([pid, mid]) => {
        const db = getDB();
        return { data: find(db.meetings[pid], mid) };
    }],
    ["PATCH", /^projects\/([^/]+)\/meetings\/([^/]+)$/, ([pid, mid], body) => {
        const db = getDB();
        Object.assign(find(db.meetings[pid], mid), body);
        saveDB(db);
        return { data: find(db.meetings[pid], mid) };
    }],
    ["DELETE", /^projects\/([^/]+)\/meetings\/([^/]+)$/, ([pid, mid]) => {
        const db = getDB();
        db.meetings[pid] = (db.meetings[pid] || []).filter((m) => m.id !== mid);
        saveDB(db);
        return {};
    }],
    ["PATCH", /^projects\/([^/]+)\/meetings\/([^/]+)\/policy$/, ([pid, mid], body) => {
        const db = getDB();
        const meeting = find(db.meetings[pid], mid);
        Object.assign(meeting.access_policy, body);
        saveDB(db);
        return { data: meeting.access_policy };
    }],
    ["POST", /^projects\/([^/]+)\/meetings\/([^/]+)\/recording$/, ([pid, mid]) => {
        const db = getDB();
        find(db.meetings[pid], mid).status = "live";
        saveDB(db);
        return { data: find(db.meetings[pid], mid) };
    }],
    ["DELETE", /^projects\/([^/]+)\/meetings\/([^/]+)\/recording$/, ([pid, mid]) => {
        const db = getDB();
        find(db.meetings[pid], mid).status = "processing";
        saveDB(db);
        return { data: find(db.meetings[pid], mid) };
    }],

    // ── Participants ──────────────────────────────────────────
    ["GET", /^projects\/([^/]+)\/meetings\/([^/]+)\/participants$/, ([, mid]) => {
        const db = getDB();
        return { data: db.participants[mid] || [] };
    }],
    ["POST", /^projects\/([^/]+)\/meetings\/([^/]+)\/participants$/, ([, mid], body) => {
        const db = getDB();
        const participant = { id: crypto.randomUUID(), role: "viewer", is_active: true, invited_at: new Date().toISOString(), ...body };
        db.participants[mid] = db.participants[mid] || [];
        db.participants[mid].push(participant);
        saveDB(db);
        return { data: participant };
    }],
    ["PATCH", /^projects\/([^/]+)\/meetings\/([^/]+)\/participants\/([^/]+)$/, ([, mid, uid], body) => {
        const db = getDB();
        const participant = (db.participants[mid] || []).find((p) => p.user_id === uid);
        Object.assign(participant, body);
        saveDB(db);
        return { data: participant };
    }],
    ["DELETE", /^projects\/([^/]+)\/meetings\/([^/]+)\/participants\/([^/]+)$/, ([, mid, uid]) => {
        const db = getDB();
        db.participants[mid] = (db.participants[mid] || []).filter((p) => p.user_id !== uid);
        saveDB(db);
        return {};
    }],

    // ── Users (team) ──────────────────────────────────────────
    ["GET", /^users\/all$/, (m, body, endpoint) => {
        const db = getDB();
        const q = qs(endpoint);
        let list = db.users;
        if (q.get("search")) {
            const term = q.get("search").toLowerCase();
            list = list.filter((u) => u.full_name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
        }
        if (q.get("is_active") !== null && q.get("is_active") !== undefined && q.has("is_active")) {
            list = list.filter((u) => String(u.is_active) === q.get("is_active"));
        }
        if (q.has("is_super_admin")) {
            list = list.filter((u) => String(u.is_super_admin) === q.get("is_super_admin"));
        }
        if (q.get("include_deleted") !== "true") list = list.filter((u) => !u.deleted_at);
        return { data: list };
    }],
    ["POST", /^users$/, (m, body) => {
        const db = getDB();
        const user = { id: crypto.randomUUID(), is_active: true, is_super_admin: false, project_count: 0, created_at: new Date().toISOString(), deleted_at: null, ...body };
        db.users.push(user);
        saveDB(db);
        return { data: user };
    }],
    ["PATCH", /^users\/([^/]+)\/toggle-active$/, ([id]) => {
        const db = getDB();
        const user = find(db.users, id);
        user.is_active = !user.is_active;
        saveDB(db);
        return { data: user };
    }],
];

export function mockApiClient(endpoint, options = {}) {
    const method = options.method || "GET";
    const body = options.body ? JSON.parse(options.body) : undefined;
    const path = seg(endpoint).join("/");

    for (const [m, re, handler] of routes) {
        if (m !== method) continue;
        const match = path.match(re);
        if (match) return Promise.resolve(handler(match.slice(1), body, endpoint));
    }

    return Promise.reject(new Error(`No mock route for ${method} ${endpoint}`));
}
