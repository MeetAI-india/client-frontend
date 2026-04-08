import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell, Search, User } from "lucide-react";

import Sidebar from "./Sidebar";

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
        <div className="flex h-screen text-white font-sans selection:bg-white/20">



            {/* 🧊 SIDEBAR COMPONENT */}
            <Sidebar />

            {/* 🧾 MAIN */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* 🧊 NAVBAR */}
                <header className="
                    h-20
                    bg-white/[0.05]
                    border-b border-white/[0.12]
                    backdrop-blur-[30px]
                    flex items-center justify-between px-8
                ">
                    {/* 🔍 SEARCH */}
                    <div className="flex-1 max-w-md relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white" size={16} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="
                                w-full
                                bg-white/[0.05]
                                border border-white/[0.10]
                                rounded-full
                                py-2 pl-10 pr-4
                                text-sm text-white
                                focus:outline-none
                                focus:border-white/[0.20]
                                focus:bg-white/[0.08]
                                transition-colors
                            "
                        />
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-6">

                        <button className="
                            relative p-2 rounded-full
                            text-white/40 hover:text-white
                            hover:bg-white/[0.06]
                            transition-colors
                        ">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full" />
                        </button>

                        <div className="h-8 w-px bg-white/[0.10]" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-[9px] uppercase text-white/40">
                                    {user?.role || "Member"}
                                </p>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.10] flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={16} className="text-white/40" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* 📄 CONTENT */}
                <main key={location.pathname} ref={mainRef} className="flex-1 overflow-y-auto">
                    <div className="w-full h-full p-6 lg:p-8">
                        <Outlet key={location.pathname} />
                    </div>
                </main>

            </div>
        </div>
    );
}
