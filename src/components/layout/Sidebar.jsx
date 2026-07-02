import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    LayoutDashboard, FolderKanban, Settings, LogOut,
    ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
    Users, Clock, Activity, Video, Briefcase,
    LayoutGrid, BarChart2, Layers, DollarSign, FolderOpen,
    Filter, Archive, ClipboardList, UserCheck, AlertCircle,
    CalendarDays, PlayCircle, TrendingUp, FileBarChart,
    Zap, Shield, User, Lock, Bell, Key, GitBranch,
} from "lucide-react";
import { logout } from "../../stores/authSlice";

// ── Nav data ──────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
    {
        label: "EXPLORE",
        items: [
            {
                id: "dashboard", name: "Dashboard", path: "/dashboard", icon: LayoutDashboard,
                sub: [
                    { name: "Overview",  path: "/dashboard", icon: LayoutGrid },
                    // { name: "Reports",   path: "/dashboard", icon: BarChart2,
                    //   children: ["Revenue", "Growth", "Team Velocity"] },
                    // { name: "Activity",  path: "/dashboard", icon: Activity,
                    //   children: ["Recent", "Timeline"] },
                ],
            },
            {
                id: "contacts", name: "Contacts", path: "/contacts", icon: Users,
                sub: [
                    { name: "All Contacts", path: "/contacts", icon: Users },
                    { name: "Segments",     path: "/contacts", icon: Layers,
                      children: ["Leads", "Clients", "Inactive"] },
                    { name: "History",      path: "/contacts", icon: Clock },
                ],
            },
            {
                id: "pipeline", name: "Pipeline", path: "/pipeline", icon: FolderKanban,
                sub: [
                    { name: "Board View", path: "/pipeline", icon: LayoutGrid },
                    { name: "Stages",     path: "/pipeline", icon: GitBranch,
                      children: ["Lead", "Qualified", "Proposal", "Closed Won"] },
                    { name: "Deals",      path: "/pipeline", icon: DollarSign },
                ],
            },
            {
                id: "projects", name: "Projects", path: "/projects", icon: Briefcase,
                sub: [
                    { name: "All Projects", path: "/projects", icon: FolderOpen },
                    { name: "By Status",    path: "/projects", icon: Filter,
                      children: ["In Progress", "On Hold", "Completed"] },
                    { name: "Archive",      path: "/projects", icon: Archive },
                ],
            },
            {
                id: "tasks", name: "Tasks", path: "/tasks", icon: Clock,
                sub: [
                    { name: "All Tasks",      path: "/tasks", icon: ClipboardList },
                    { name: "Assigned to Me", path: "/tasks", icon: UserCheck },
                    { name: "By Priority",    path: "/tasks", icon: AlertCircle,
                      children: ["High", "Medium", "Low"] },
                ],
            },
            {
                id: "meetings", name: "Meetings", path: "/meetings", icon: Video,
                sub: [
                    { name: "All Meetings", path: "/meetings", icon: CalendarDays },
                    { name: "Upcoming",     path: "/meetings", icon: Clock },
                    { name: "Recordings",   path: "/meetings", icon: PlayCircle,
                      children: ["Videos", "Transcripts", "Highlights"] },
                ],
            },
            {
                id: "analytics", name: "Analytics", path: "/analytics", icon: Activity,
                sub: [
                    { name: "Overview", path: "/analytics", icon: TrendingUp },
                    { name: "Reports",  path: "/analytics", icon: FileBarChart,
                      children: ["Sales Funnel", "Team Performance", "Deal Velocity"] },
                    { name: "Insights", path: "/analytics", icon: Zap },
                ],
            },
        ],
    },
    {
        label: "WORKSPACE",
        items: [
            {
                id: "team", name: "Team", path: "/team", icon: Users,
                sub: [
                    { name: "Members",      path: "/team", icon: Users },
                    { name: "Roles",        path: "/team", icon: Shield,
                      children: ["Admins", "Members", "Viewers"] },
                    { name: "Activity",     path: "/team", icon: Activity },
                ],
            },
            {
                id: "settings", name: "Settings", path: "/settings", icon: Settings,
                sub: [
                    { name: "Profile",       path: "/settings", icon: User },
                    { name: "Security",      path: "/settings", icon: Lock,
                      children: ["Password", "Two-Factor Auth", "Sessions"] },
                    { name: "Notifications", path: "/settings", icon: Bell },
                    { name: "API Access",    path: "/settings", icon: Key },
                ],
            },
        ],
    },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

// ── Tooltip class (reused across rail items) ──────────────────────────────────

const TT = "absolute top-full left-1/2 mt-0 whitespace-nowrap bg-gray-900/85 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none translate-y-1 group-hover:translate-y-0 transition-all duration-200 shadow-2xl z-[100]";

// ── Component ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [primaryOpen, setPrimaryOpen] = useState(true);
    const [panelOpen,   setPanelOpen]   = useState(() => {
        const p = window.location.pathname;
        return ALL_ITEMS.some(
            (n) => p === n.path || (n.path !== "/dashboard" && p.startsWith(n.path))
        );
    });
    // { sectionId, name } — auto-invalidates when section changes
    const [expandedSub, setExpandedSub] = useState(null);
    const [activeChild, setActiveChild] = useState(null);

    // Derived from location — auto-updates on route change
    const activeItem = ALL_ITEMS.find(
        (n) =>
            location.pathname === n.path ||
            (n.path !== "/dashboard" && location.pathname.startsWith(n.path))
    );

    // Only valid for the current section
    const expandedSubName = expandedSub?.sectionId === activeItem?.id ? expandedSub.name : null;
    const activeChildKey  = activeChild?.sectionId  === activeItem?.id ? activeChild.key  : null;

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleRailClick = (item) => {
        const isSame  = activeItem?.id === item.id;
        const hasSub  = (item.sub?.length ?? 0) > 1;

        if (!hasSub) {
            navigate(item.path);
            setPanelOpen(false);
        } else if (isSame && panelOpen) {
            setPanelOpen(false);
        } else {
            navigate(item.path);
            setPanelOpen(true);
        }
    };

    const handleCollapse = () => { setPrimaryOpen(false); setPanelOpen(false); };

    const handleRestore = () => {
        setPrimaryOpen(true);
        if (activeItem?.sub?.length) setPanelOpen(true);
    };

    const handleLogout = () => { dispatch(logout()); navigate("/login"); };

    const toggleSub = (name) =>
        setExpandedSub((prev) =>
            prev?.sectionId === activeItem?.id && prev?.name === name
                ? null
                : { sectionId: activeItem?.id, name }
        );

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="flex shrink-0 h-full z-50">

            {/* ── Restore strip (thin tab when fully collapsed) ────────── */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${!primaryOpen ? "w-[18px]" : "w-0"}`}>
                <div className="w-[18px] h-full flex flex-col items-center pt-[22px] bg-white/[0.03] border-r border-white/[0.08]">
                    <button
                        onClick={handleRestore}
                        className="text-white/20 hover:text-white/70 transition-colors duration-200 p-1"
                        title="Expand sidebar"
                    >
                        <ChevronRight size={10} />
                    </button>
                </div>
            </div>

            {/* ── Primary rail ─────────────────────────────────────────── */}
            <div className={`transition-all duration-300 ease-in-out ${primaryOpen ? "w-[64px] overflow-visible" : "w-0 overflow-hidden"}`}>
                <aside className="w-[64px] h-full flex flex-col bg-white/[0.05] backdrop-blur-[30px] border-r border-white/[0.12] relative z-10">

                    {/* Nav groups */}
                    <nav className="flex-1 py-4">
                        {NAV_GROUPS.map((group, gi) => (
                            <div key={gi} className={gi > 0 ? "mt-4" : ""}>

                                {/* Divider before non-first groups */}
                                {gi > 0 && <div className="mx-3 mb-3 border-t border-white/[0.07]" />}

                                {/* Section label */}
                                <p className="text-[8px] uppercase tracking-[0.22em] font-black text-white/20 text-center mb-2 select-none">
                                    {group.label}
                                </p>

                                <div className="flex flex-col items-center gap-[3px] px-2">
                                    {group.items.map((item) => {
                                        const isActive = activeItem?.id === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => handleRailClick(item)}
                                                className={`
                                                    relative w-full h-11 flex items-center justify-center
                                                    rounded-xl transition-all duration-200 group border
                                                    ${isActive
                                                        ? "bg-white/[0.12] text-white border-white/[0.14] shadow-sm"
                                                        : "text-white/38 hover:text-white hover:bg-white/[0.07] border-transparent"
                                                    }
                                                `}
                                            >
                                                <item.icon
                                                    size={18}
                                                    className="shrink-0 transition-transform duration-150 group-hover:scale-110"
                                                />
                                                <span className={TT}>{item.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="px-2 pb-4 pt-3 border-t border-white/[0.08] shrink-0 flex flex-col items-center gap-[3px]">
                        <button
                            onClick={handleLogout}
                            className="relative w-full h-11 flex items-center justify-center rounded-xl text-white/35 hover:text-white hover:bg-white/[0.07] transition-all group border border-transparent"
                        >
                            <LogOut size={17} />
                            <span className={TT}>Logout</span>
                        </button>
                        <button
                            onClick={handleCollapse}
                            className="w-full h-9 flex items-center justify-center rounded-xl text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all border border-transparent"
                            title="Collapse"
                        >
                            <ChevronLeft size={13} />
                        </button>
                    </div>
                </aside>
            </div>

            {/* ── Secondary panel ──────────────────────────────────────── */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${panelOpen && activeItem ? "w-[220px]" : "w-0"}`}>
                <aside className="w-[220px] h-full flex flex-col bg-white/[0.04] backdrop-blur-[30px] border-r border-white/[0.10]">

                    {/* Accordion menu */}
                    <nav className="flex-1 py-5 px-3 overflow-y-auto no-scrollbar flex flex-col gap-[2px]">

                        {/* Section name — inside nav, not pinned header */}
                        <p className="text-[10px] uppercase tracking-[0.22em] font-black text-white/25 px-3 pb-3 pt-1 select-none">
                            {activeItem?.name}
                        </p>
                        {activeItem?.sub?.map((sub) => {
                            const hasChildren = sub.children?.length > 0;
                            const isExpanded  = expandedSubName === sub.name;

                            return (
                                <div key={sub.name}>
                                    {/* Category row — icon+name | chevron */}
                                    <button
                                        onClick={() =>
                                            hasChildren
                                                ? toggleSub(sub.name)
                                                : navigate(sub.path)
                                        }
                                        className={`
                                            w-full flex items-center justify-between px-3 py-[9px]
                                            rounded-xl text-[13px] transition-all duration-150
                                            ${isExpanded
                                                ? "text-white font-bold"
                                                : "text-white/45 font-semibold hover:text-white hover:bg-white/[0.06]"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <sub.icon
                                                size={15}
                                                className={`shrink-0 transition-colors ${isExpanded ? "opacity-90" : "opacity-50"}`}
                                            />
                                            <span className="leading-none">{sub.name}</span>
                                        </div>
                                        {hasChildren && (
                                            isExpanded
                                                ? <ChevronUp   size={13} className="shrink-0 opacity-50" />
                                                : <ChevronDown size={13} className="shrink-0 opacity-25" />
                                        )}
                                    </button>

                                    {/* Children (accordion) */}
                                    {hasChildren && (
                                        <div className={`
                                            overflow-hidden transition-all duration-250 ease-in-out
                                            ${isExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}
                                        `}>
                                            <div className="ml-8 mt-1 flex flex-col gap-[2px] border-l border-white/[0.08] pl-2 pb-1">
                                                {sub.children.map((child) => {
                                                    const isChildActive = activeChildKey === `${sub.name}:${child}`;
                                                    return (
                                                        <button
                                                            key={child}
                                                            onClick={() => {
                                                                setActiveChild({ sectionId: activeItem?.id, key: `${sub.name}:${child}` });
                                                                navigate(sub.path);
                                                            }}
                                                            className={`
                                                                w-full text-left px-3 py-[7px] rounded-md
                                                                text-[12.5px] transition-all duration-150
                                                                ${isChildActive
                                                                    ? "bg-white/[0.10] text-white font-semibold"
                                                                    : "text-white/38 font-medium hover:text-white hover:bg-white/[0.06]"
                                                                }
                                                            `}
                                                        >
                                                            {child}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Panel footer */}
                    <div className="px-3 pb-4 pt-3 border-t border-white/[0.08] shrink-0">
                        <button
                            onClick={() => setPanelOpen(false)}
                            className="
                                w-full flex items-center gap-2 px-4 py-2.5 rounded-xl
                                text-[10px] uppercase tracking-[0.15em] font-black
                                text-white/22 hover:text-white/55 hover:bg-white/[0.04]
                                transition-all border border-transparent
                            "
                        >
                            <ChevronLeft size={11} />
                            Close
                        </button>
                    </div>
                </aside>
            </div>

        </div>
    );
}
