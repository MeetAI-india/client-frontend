import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    LayoutDashboard,
    FolderKanban,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Users,
    Clock,
    Activity,
    Video,
    Briefcase
} from "lucide-react";
import { logout } from "../../stores/authSlice";
import logo from "../../assets/logo.png";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Contacts", path: "/contacts", icon: Users },
        { name: "Pipeline", path: "/pipeline", icon: FolderKanban },
        { name: "Projects", path: "/projects", icon: Briefcase },
        { name: "Tasks", path: "/tasks", icon: Clock },
        { name: "Meetings", path: "/meetings", icon: Video },
        { name: "Analytics", path: "/analytics", icon: Activity },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    return (
        <aside className={`
            relative z-20 flex flex-col
            bg-white/[0.05]
            border-r border-white/[0.12]
            backdrop-blur-[30px]
            transition-all duration-500
            overflow-visible
            ${isCollapsed ? "w-24" : "w-64"}
        `}>

            {/* 🔰 LOGO */}
            <div className="h-20 flex items-center px-6 border-b border-white/[0.12]">
                <div className="w-10 h-10 min-w-10 rounded-xl bg-white/[0.05] border border-white/[0.10] flex items-center justify-center overflow-hidden">
                    <img src={logo} alt="logo" />
                </div>

                {!isCollapsed && (
                    <span className="ml-3 font-bold text-lg text-white whitespace-nowrap overflow-hidden transition-all duration-500">
                        Antigravity
                    </span>
                )}
            </div>

            {/* 🔗 NAV */}
            <nav className="flex-1 py-8 px-3 space-y-3 overflow-y-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <div key={item.name}>
                            <Link
                                to={item.path}
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-2xl
                                    transition-all group relative border border-transparent
                                    ${isCollapsed ? "justify-center" : ""}
                                    ${isActive
                                        ? "bg-white/[0.08] border-white/[0.15] text-white"
                                        : "text-white/40 hover:text-white hover:bg-white/[0.06]"
                                    }
                                `}
                            >
                                <item.icon size={isCollapsed ? 28 : 22} className="transition-all group-hover:scale-110 shrink-0" />

                                {!isCollapsed && (
                                    <span className="text-sm font-semibold whitespace-nowrap overflow-hidden">
                                        {item.name}
                                    </span>
                                )}

                                {isCollapsed && (
                                    <span className="absolute left-full ml-3 whitespace-nowrap bg-black/80 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 pointer-events-none shadow-lg z-50">
                                        {item.name}
                                    </span>
                                )}
                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/70 rounded-r-full" />}
                            </Link>
                        </div>
                    );
                })}
            </nav>

            {/* 🔻 FOOTER */}
            <div className="p-4 border-t border-white/[0.12] space-y-3">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/40 hover:text-white transition-all"
                >
                    {isCollapsed ? (
                        <ChevronRight size={20} />
                    ) : (
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black">
                            <ChevronLeft size={14} /> Collapse
                        </div>
                    )}
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all group relative"
                >
                    <LogOut size={18} className="shrink-0" />
                    {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">Logout</span>}

                    {isCollapsed && (
                        <span className="absolute left-full ml-3 whitespace-nowrap bg-black/80 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg z-50">
                            Logout
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
}
