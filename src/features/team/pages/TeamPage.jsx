import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
    Users,
    Search,
    Filter,
    Mail,
    Shield,
    ShieldCheck,
    X,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    Power,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import Form from "@/components/Form";
import { getUsers, createUser, toggleUserActive } from "../api/users";
import {
    USER_CREATE_FIELDS,
    FILTER_OPTIONS,
    ADMIN_FILTER_OPTIONS,
    formatUserStatusLabel,
    getUserStatusVariant,
} from "../constants";
import { useSelector } from "react-redux";

// ── Pagination ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

// ── (scrollbar styles moved to src/components/scrollbar.css) ────

// ── Page ────────────────────────────────────────────────────────────────────

export default function TeamPage() {
    // ── Data state ──────────────────────────────────────────────────────
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ── Filters ─────────────────────────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const [adminFilter, setAdminFilter] = useState(null);
    const [includeDeleted, setIncludeDeleted] = useState(true);
    const [offset, setOffset] = useState(0);

    // ── Filter dropdown state ───────────────────────────────────────────
    const [filterOpen, setFilterOpen] = useState(false);
    const filterRef = useRef(null);

    // ── Modal state ─────────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [serverErrors, setServerErrors] = useState({});

    // ── Slide-over panel state ──────────────────────────────────────────
    const [selectedUser, setSelectedUser] = useState(null);
    const [togglingUserId, setTogglingUserId] = useState(null);
    const currentUserId = useSelector((state) => state.auth.user?.id);

    // ── Derived ─────────────────────────────────────────────────────────
    const totalPages = useMemo(
        () => Math.ceil(total / PAGE_SIZE),
        [total]
    );
    const currentPage = useMemo(
        () => Math.floor(offset / PAGE_SIZE) + 1,
        [offset]
    );

    // ── Debounce search ─────────────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setOffset(0);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // ── Fetch users ─────────────────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getUsers({
                search: searchTerm || undefined,
                is_active: statusFilter,
                is_super_admin: adminFilter,
                include_deleted: includeDeleted,
                offset,
                limit: PAGE_SIZE,
            });

            const data = response?.data;
            if (data) {
                setUsers(Array.isArray(data.users) ? data.users : []);
                setTotal(typeof data.total === "number" ? data.total : 0);
            } else {
                setUsers([]);
                setTotal(0);
            }
        } catch (err) {
            setError(err.message || "Failed to load users");
            setUsers([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter, adminFilter, includeDeleted, offset]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // ── Close filter dropdown on outside click ──────────────────────────
    useEffect(() => {
        if (!filterOpen) return;

        const handleClickOutside = (e) => {
            if (!filterRef.current?.contains(e.target)) {
                setFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filterOpen]);

    // ── Reset offset when filters change ────────────────────────────────
    useEffect(() => {
        setOffset(0);
    }, [statusFilter, adminFilter, includeDeleted]);

    // ── Close sidebar on Escape ─────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && selectedUser) {
                setSelectedUser(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [selectedUser]);

    // ── Modal helpers ───────────────────────────────────────────────────
    const openCreateModal = () => {
        setFormValues({ is_super_admin: false });
        setServerErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        if (!formLoading) {
            setModalOpen(false);
        }
    };

    const handleChange = (key, val) =>
        setFormValues((prev) => ({ ...prev, [key]: val }));

    // ── Submit (create user) ────────────────────────────────────────────
    const handleSubmit = async (data) => {
        setFormLoading(true);
        setServerErrors({});

        try {
            const payload = {
                email: data.email,
                password: data.password,
                full_name: data.full_name,
                is_super_admin: data.is_super_admin ?? false,
            };

            await createUser(payload);

            setOffset(0);
            await fetchUsers();
            setModalOpen(false);
        } catch (err) {
            if (err.detail && Array.isArray(err.detail)) {
                const errors = {};
                err.detail.forEach((e) => {
                    const field = e.loc?.[e.loc.length - 1];
                    if (field) errors[field] = e.msg;
                });
                setServerErrors(errors);
            } else {
                setServerErrors({ _form: err.message || "Failed to create user" });
            }
        } finally {
            setFormLoading(false);
        }
    };

    // ── Toggle active ───────────────────────────────────────────────────
    const handleToggleActive = async (user) => {
        if (togglingUserId) return;

        const action = user.is_active ? "deactivate" : "activate";
        const deletedNote = user.deleted_at ? " (and clear deleted status)" : "";
        const confirmed = window.confirm(
            `${action.charAt(0).toUpperCase() + action.slice(1)} "${user.full_name}"${deletedNote}?`
        );
        if (!confirmed) return;

        setTogglingUserId(user.id);

        try {
            const response = await toggleUserActive(user.id);
            const result = response?.data;

            if (result) {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === user.id
                            ? {
                                ...u,
                                is_active: result.is_active,
                                deleted_at: result.is_active ? null : u.deleted_at,
                            }
                            : u
                    )
                );
                if (selectedUser?.id === user.id) {
                    setSelectedUser((prev) => ({
                        ...prev,
                        is_active: result.is_active,
                        deleted_at: result.is_active ? null : prev.deleted_at,
                    }));
                }
            } else {
                await fetchUsers();
            }
        } catch (err) {
            setError(err.message || `Failed to ${action} user`);
        } finally {
            setTogglingUserId(null);
        }
    };

    // ── Pagination helpers ──────────────────────────────────────────────
    const goToPage = (page) => {
        setOffset((page - 1) * PAGE_SIZE);
    };

    const goToPrev = () => {
        if (offset > 0) setOffset((prev) => Math.max(0, prev - PAGE_SIZE));
    };

    const goToNext = () => {
        if (offset + PAGE_SIZE < total) setOffset((prev) => prev + PAGE_SIZE);
    };

    // ── Render ──────────────────────────────────────────────────────────

    return (
        <>
            {/* ── Main Content (no overflow-hidden here) ── */}
            <div className="h-full flex flex-col animate-fade-in">
                <header className="mb-8 flex justify-between items-end shrink-0">
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                            Team Management
                        </h1>
                        <p className="text-white/40 font-medium">
                            Coordinate your collective intelligence.
                        </p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Users size={14} /> Create User
                    </Button>
                </header>

                {/* ── Controls ── */}
                <div className="flex gap-4 mb-6 shrink-0">
                    <div className="flex-1 relative group">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/[0.25] focus:bg-white/[0.08] transition-all"
                        />
                    </div>

                    {/* Filter dropdown */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setFilterOpen((prev) => !prev)}
                            className={`px-3 py-1.5 border rounded-lg flex items-center gap-2 transition-all ${statusFilter !== null ||
                                    adminFilter !== null ||
                                    !includeDeleted
                                    ? "bg-white/[0.1] border-white/[0.25] text-white"
                                    : "bg-white/[0.05] border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.08]"
                                }`}
                        >
                            <Filter size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                Filter
                            </span>
                            {(statusFilter !== null ||
                                adminFilter !== null ||
                                !includeDeleted) && (
                                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                                )}
                        </button>

                        {filterOpen && (
                            <div className="absolute right-0 top-14 z-30 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-2xl p-1">
                                <div className="px-3 py-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                        Status
                                    </span>
                                </div>
                                {FILTER_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.key}
                                        onClick={() => setStatusFilter(opt.is_active)}
                                        className={`w-full px-3 py-2.5 text-left text-xs font-bold uppercase tracking-widest transition-colors rounded-lg ${statusFilter === opt.is_active
                                                ? "bg-white/10 text-white"
                                                : "text-white/50 hover:bg-white/5 hover:text-white/80"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}

                                <div className="border-t border-white/[0.08] my-1" />

                                <div className="px-3 py-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                        User Type
                                    </span>
                                </div>
                                {ADMIN_FILTER_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.key}
                                        onClick={() => setAdminFilter(opt.is_super_admin)}
                                        className={`w-full px-3 py-2.5 text-left text-xs font-bold uppercase tracking-widest transition-colors rounded-lg ${adminFilter === opt.is_super_admin
                                                ? "bg-white/10 text-white"
                                                : "text-white/50 hover:bg-white/5 hover:text-white/80"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}

                                <div className="border-t border-white/[0.08] my-1" />

                                <button
                                    onClick={() => setIncludeDeleted((prev) => !prev)}
                                    className={`w-full px-3 py-2.5 text-left text-xs font-bold uppercase tracking-widest transition-colors rounded-lg ${includeDeleted
                                            ? "bg-white/10 text-white"
                                            : "text-white/50 hover:bg-white/5 hover:text-white/80"
                                        }`}
                                >
                                    Include Deleted
                                </button>

                                <div className="border-t border-white/[0.08] my-1" />

                                <button
                                    onClick={() => {
                                        setStatusFilter(null);
                                        setAdminFilter(null);
                                        setIncludeDeleted(true);
                                    }}
                                    className="w-full px-3 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-blue-300/70 hover:bg-blue-500/10 hover:text-blue-300 transition-colors rounded-lg"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="bg-white/[0.03] border border-white/[0.1] rounded-[30px] overflow-hidden flex-1 flex flex-col p-1 min-h-0">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                            <Loader2 size={18} className="animate-spin mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">
                                Loading users...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-red-400/70">
                            <AlertCircle size={18} className="mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">
                                {error}
                            </p>
                            <button
                                onClick={fetchUsers}
                                className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto overflow-y-auto rounded-[26px] flex-1 min-h-0 no-scrollbar">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/[0.08] sticky top-0 bg-[#0A0A0A] z-10">
                                        <tr>
                                            <th className="px-6 py-5">User</th>
                                            <th className="px-6 py-5">Role</th>
                                            <th className="px-6 py-5">Status</th>
                                            <th className="px-6 py-5">Projects</th>
                                            <th className="px-6 py-5 text-right font-black">Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.05]">
                                        {users
                                            .filter((u) => u.id !== currentUserId)
                                            .map((user) => (
                                                <tr
                                                    key={user.id}
                                                    onClick={() => setSelectedUser(user)}
                                                    className={`hover:bg-white/[0.06] transition-colors group relative cursor-pointer ${selectedUser?.id === user.id ? "bg-white/[0.08]" : ""
                                                        }`}
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/10 flex items-center justify-center text-sm font-bold text-white group-hover:scale-105 transition-transform duration-300">
                                                                {user.full_name?.charAt(0)?.toUpperCase() || "?"}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white tracking-tight">
                                                                    {user.full_name}
                                                                </div>
                                                                <div className="text-xs text-white/40 font-medium">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            {user.is_super_admin ? (
                                                                <>
                                                                    <ShieldCheck size={14} className="text-amber-400/80" />
                                                                    <span className="text-amber-300/90 font-bold text-xs uppercase tracking-widest">
                                                                        Super Admin
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Shield size={14} className="text-white/20" />
                                                                    <span className="text-white/50 font-bold text-xs uppercase tracking-widest">
                                                                        User
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Badge variant={getUserStatusVariant(user)}>
                                                            {formatUserStatusLabel(user)}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-white/50 font-bold text-xs">
                                                            {user.project_count ?? 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleActive(user);
                                                            }}
                                                            disabled={togglingUserId === user.id}
                                                            className={`p-2 rounded-lg transition-all ${user.is_active
                                                                    ? "text-white/20 hover:text-amber-400 hover:bg-amber-500/10"
                                                                    : "text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10"
                                                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                                                            title={user.is_active ? "Deactivate User" : "Activate User"}
                                                        >
                                                            {togglingUserId === user.id ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : (
                                                                <Power size={16} />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>

                                {users.filter((u) => u.id !== currentUserId).length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-white/20 font-bold uppercase tracking-widest text-xs">
                                        <Users size={22} className="mb-4 opacity-20" />
                                        {searchTerm || statusFilter !== null || adminFilter !== null
                                            ? "No matches found"
                                            : "No users in your database"}
                                    </div>
                                )}
                            </div>

                            {/* ── Pagination ── */}
                            {total > PAGE_SIZE && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] shrink-0">
                                    <span className="text-xs text-white/30 font-bold uppercase tracking-widest">
                                        {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={goToPrev}
                                            disabled={offset === 0}
                                            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter((page) => {
                                                if (page <= 2) return true;
                                                if (page >= totalPages - 1) return true;
                                                if (Math.abs(page - currentPage) <= 1) return true;
                                                return false;
                                            })
                                            .reduce((acc, page, i, arr) => {
                                                if (i > 0 && page - arr[i - 1] > 1) {
                                                    acc.push(
                                                        <span key={`ellipsis-${page}`} className="px-2 text-white/20">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                acc.push(
                                                    <button
                                                        key={page}
                                                        onClick={() => goToPage(page)}
                                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === currentPage
                                                                ? "bg-white/10 text-white"
                                                                : "text-white/40 hover:text-white hover:bg-white/5"
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                                return acc;
                                            }, [])}

                                        <button
                                            onClick={goToNext}
                                            disabled={offset + PAGE_SIZE >= total}
                                            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                Sidebar + Backdrop — RENDERED AT ROOT LEVEL, outside the
                animated flex container so `fixed` positioning works and
                nothing gets clipped by a parent's overflow-hidden/transform.
            ══════════════════════════════════════════════════════════════ */}

            {/* ── Backdrop ── */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${selectedUser ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setSelectedUser(null)}
                aria-hidden="true"
            />

            {/* ── Slide-over Profile Panel ── */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#050505] border-l border-white/[0.1] shadow-2xl transition-transform duration-500 ease-out z-50 flex flex-col ${selectedUser ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {selectedUser && (
                    <>
                        {/* ── Header (pinned) ── */}
                        <div className="flex items-center justify-between px-8 py-6 shrink-0 border-b border-white/[0.06]">
                            <h2 className="text-lg font-black tracking-tight text-white">
                                User Profile
                            </h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 bg-white/[0.05] rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* ── Scrollable Content ── */}
                        <div className="flex-1 overflow-y-auto px-8 py-8 min-h-0">
                            {/* Avatar + Name */}
                            <div className="flex flex-col items-center mb-10">
                                <div className="w-12 h-12 rounded-xl bg-white/[0.1] mb-3 flex items-center justify-center text-base font-black text-white border border-white/10 shadow-lg">
                                    {selectedUser.full_name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <h3 className="text-base font-black text-white tracking-tight">
                                    {selectedUser.full_name}
                                </h3>
                                <p className="text-[10px] text-white/50 font-bold mt-1.5 uppercase tracking-widest">
                                    {selectedUser.is_super_admin ? "Super Admin" : "User"}
                                </p>
                            </div>

                            {/* Toggle Active Button */}
                            <div className="mb-10">
                                <Button
                                    variant={selectedUser.is_active ? "secondary" : "primary"}
                                    className="w-full py-3 flex items-center justify-center gap-2"
                                    onClick={() => handleToggleActive(selectedUser)}
                                    disabled={togglingUserId === selectedUser.id}
                                >
                                    {togglingUserId === selectedUser.id ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Power size={16} />
                                    )}
                                    {togglingUserId === selectedUser.id
                                        ? "Updating..."
                                        : selectedUser.is_active
                                            ? "Deactivate User"
                                            : "Activate User"}
                                </Button>
                                {selectedUser.deleted_at && (
                                    <p className="text-xs text-amber-400/60 text-center mt-2 font-medium">
                                        Activating will clear deleted status
                                    </p>
                                )}
                            </div>

                            {/* User Details */}
                            <div className="space-y-5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                    User Details
                                </h4>

                                <DetailRow label="Email">
                                    <span className="text-sm font-medium text-white/80 break-all">
                                        {selectedUser.email}
                                    </span>
                                </DetailRow>

                                <DetailRow label="Status">
                                    <Badge variant={getUserStatusVariant(selectedUser)}>
                                        {formatUserStatusLabel(selectedUser)}
                                    </Badge>
                                </DetailRow>

                                <DetailRow label="Role">
                                    <div className="flex items-center gap-1.5">
                                        {selectedUser.is_super_admin ? (
                                            <ShieldCheck size={14} className="text-amber-400/80" />
                                        ) : (
                                            <Shield size={14} className="text-white/30" />
                                        )}
                                        <span
                                            className={`text-xs font-bold uppercase tracking-widest ${selectedUser.is_super_admin ? "text-amber-300/90" : "text-white/50"
                                                }`}
                                        >
                                            {selectedUser.is_super_admin ? "Super Admin" : "User"}
                                        </span>
                                    </div>
                                </DetailRow>

                                <DetailRow label="Projects">
                                    <span className="text-sm font-bold text-white/60">
                                        {selectedUser.project_count ?? 0}
                                    </span>
                                </DetailRow>

                                <DetailRow label="Created">
                                    <span className="text-xs font-medium text-white/50">
                                        {new Date(selectedUser.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </DetailRow>

                                {selectedUser.deleted_at && (
                                    <div className="flex justify-between items-baseline border-b border-red-500/20 pb-3">
                                        <span className="text-[10px] uppercase font-bold text-red-400/50 tracking-widest">
                                            Deleted
                                        </span>
                                        <span className="text-xs font-medium text-red-400/70">
                                            {new Date(selectedUser.deleted_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* System Reference */}
                            <div className="mt-10 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                    System Reference
                                </h4>
                                <Card className="p-4">
                                    <code className="text-xs text-white/30 font-mono break-all">
                                        {selectedUser.id}
                                    </code>
                                </Card>
                            </div>
                        </div>

                        {/* ── Footer (pinned) ── */}
                        <div className="px-8 py-6 border-t border-white/[0.06] shrink-0 bg-[#050505]">
                            <Button
                                variant="secondary"
                                className="w-full py-3 text-white/70 hover:text-white flex items-center justify-center gap-2"
                                onClick={() => window.open(`mailto:${selectedUser.email}`, "_blank")}
                            >
                                <Mail size={14} /> Send Email
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* ── Create User Modal ── */}
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title="Create New User"
                description="Initialize a new user account. Password must be at least 8 characters."
                size="lg"
            >
                {serverErrors._form && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-xs text-red-400 font-bold">{serverErrors._form}</p>
                    </div>
                )}
                <Form
                    fields={USER_CREATE_FIELDS}
                    values={formValues}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    errors={serverErrors}
                    submitLabel="Create User"
                    loading={formLoading}
                />
            </Modal>
        </>
    );
}

// ── Small helper component to keep the detail rows DRY ─────────────────────

function DetailRow({ label, children }) {
    return (
        <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
            <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest shrink-0 mr-4">
                {label}
            </span>
            <div className="text-right">{children}</div>
        </div>
    );
}