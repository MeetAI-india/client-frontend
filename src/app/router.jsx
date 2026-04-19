import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Static components (Core logic)
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy-loaded UI components
const LoginPage = lazy(() => import("../features/auth/routes/login"));
const DashboardLayout = lazy(() => import("../components/layout/DashboardLayout"));
const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));
const ContactsPage = lazy(() => import("../features/contacts/pages/ContactsPage"));
const PipelinePage = lazy(() => import("../features/pipeline/pages/PipelinePage"));
const ProjectsPage = lazy(() => import("../features/projects/pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("../features/projects/pages/ProjectDetailPage"));
const TasksPage = lazy(() => import("../features/tasks/pages/TasksPage"));
const MeetingsPage = lazy(() => import("../features/meetings/pages/MeetingsPage"));
const MeetingDetailPage = lazy(() => import("../features/meetings/pages/MeetingDetailPage"));
const AnalyticsPage = lazy(() => import("../features/analytics/pages/AnalyticsPage"));
const SettingsPage = lazy(() => import("../features/settings/pages/SettingsPage"));
const TeamPage = lazy(() => import("../features/team/pages/TeamPage"));


const LoadingFallback = () => (
    <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="relative">
            <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
        </div>
    </div>
);

export default function AppRouter() {
    const { user, loading, initialized } = useSelector((state) => state.auth);

    if (!initialized || loading) {
        return <LoadingFallback />;
    }

    return (
        <Suspense fallback={<LoadingFallback />}>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/contacts" element={<ContactsPage />} />
                            <Route path="/pipeline" element={<PipelinePage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/projects/:id" element={<ProjectDetailPage />} />
                            <Route path="/tasks" element={<TasksPage />} />
                            <Route path="/meetings" element={<MeetingsPage />} />
                            <Route path="/meetings/:id" element={<MeetingDetailPage />} />
                            <Route path="/analytics" element={<AnalyticsPage />} />
                            <Route path="/team" element={<TeamPage />} />
                            <Route path="/settings" element={<SettingsPage />} />

                        </Route>
                    </Route>

                    {/* Default Redirect */}
                    <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
}
