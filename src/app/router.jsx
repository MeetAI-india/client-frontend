import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Static components (Core logic)
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy-loaded UI components
const LoginPage = lazy(() => import("../features/auth/routes/login"));
const SignupPage = lazy(() => import("../features/auth/routes/signup"));
const DashboardLayout = lazy(() => import("../components/layout/DashboardLayout"));
const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));
const ProjectsPage = lazy(() => import("../features/projects/pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("../features/projects/pages/ProjectDetailPage"));
const TasksPage = lazy(() => import("../features/tasks/pages/TasksPage"));
const MeetingsPage = lazy(() => import("../features/meetings/pages/MeetingsPage"));
const MeetingDetailPage = lazy(() => import("../features/meetings/pages/MeetingDetailPage"));
const MeetingTasksPage = lazy(() => import("../features/meetings/pages/MeetingTasksPage"));
const SettingsPage = lazy(() => import("../features/settings/pages/SettingsPage"));
const ProfilePage = lazy(() => import("../features/auth/pages/ProfilePage"));
const TeamPage = lazy(() => import("../features/team/pages/TeamPage"));
const ExamplePage = lazy(() => import("../features/examples/pages/ExamplePage"));
const UIKitPage = lazy(() => import("../features/examples/pages/UIKitPage"));
const PatternsPage = lazy(() => import("../features/examples/pages/PatternsPage"));
const PatternLoadingPage = lazy(() => import("../features/examples/pages/PatternLoadingPage"));
const PatternEmptyStatePage = lazy(() => import("../features/examples/pages/PatternEmptyStatePage"));
const PatternErrorStatePage = lazy(() => import("../features/examples/pages/PatternErrorStatePage"));


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
                    <Route
                        path="/signup"
                        element={
                            user
                                ? <Navigate to="/dashboard" replace />
                                : <SignupPage />
                        }
                    />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/projects/:id" element={<ProjectDetailPage />} />
                            <Route path="/tasks" element={<TasksPage />} />
                            <Route path="/meetings" element={<MeetingsPage />} />
                            <Route path="/meetings/tasks" element={<MeetingTasksPage />} />
                            <Route path="/meetings/:id" element={<MeetingDetailPage />} />
                            <Route path="/team" element={<TeamPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/settings/profile" element={<ProfilePage />} />
                            <Route path="/examples" element={<ExamplePage />} />
                            <Route path="/examples/ui-kit" element={<UIKitPage />} />
                            <Route path="/examples/patterns" element={<PatternsPage />} />
                            <Route path="/examples/patterns/loading" element={<PatternLoadingPage />} />
                            <Route path="/examples/patterns/empty-state" element={<PatternEmptyStatePage />} />
                            <Route path="/examples/patterns/error-state" element={<PatternErrorStatePage />} />

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
