import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell, Search, User } from "lucide-react";

import Sidebar from "./Sidebar";
import logo from "../../assets/logo.png";

export default function DashboardLayout() {
    const user = useSelector((state) => state.auth.user);
    const location = useLocation();
    const mainRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = "";
        window.scrollTo({ top: 0, behavior: "auto" });
        mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, [location.pathname]);

    return (
        <div className="flex flex-col h-screen text-white font-sans selection:bg-white/20">

            {/* NAVBAR — full width, above sidebars */}
            <header className="h-16 shrink-0 bg-white/[0.05] border-b border-white/[0.12] backdrop-blur-[30px] flex items-center z-40">

                {/* LOGO — matches primary rail width */}
                <div className="w-[64px] shrink-0 flex items-center justify-center border-r border-white/[0.08] h-full">
                    <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
                </div>

                <div className="flex-1" />

                {/* RIGHT */}
                <div className="flex items-center gap-5 pr-6">
                    {/* SEARCH */}
                    <div className="max-w-sm relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white" size={15} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-white/[0.05] border border-white/[0.10] rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-white/[0.20] focus:bg-white/[0.08] transition-colors"
                        />
                    </div>

                    <button className="relative p-2 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors">
                        <Bell size={17} />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full" />
                    </button>

                    <div className="h-7 w-px bg-white/[0.10]" />

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white">{user?.name || "User"}</p>
                            <p className="text-[9px] uppercase text-white/40">{user?.role || "Member"}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.10] flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={15} className="text-white/40" />
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* SIDEBAR + CONTENT ROW */}
            <div className="flex flex-1 min-h-0">
                <Sidebar />
                <main key={location.pathname} ref={mainRef} className="flex-1 overflow-y-auto">
                    <div className="w-full h-full p-6 lg:p-8">
                        <Outlet key={location.pathname} />
                    </div>
                </main>
            </div>
        </div>
    );
}
