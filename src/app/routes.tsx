import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PrivateLayout } from '@/shared/components/layout/PrivateLayout/PrivateLayout';
import { PublicLayout } from '@/shared/components/layout/PublicLayout/PublicLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { TopicsPage } from '@/features/topics/pages/TopicsPage';
import { TopicDetailPage } from '@/features/topics/pages/TopicDetailPage';
import { CyclePage } from '@/features/cycle/pages/CyclePage/CyclePage';
import { PerformancePage } from '@/features/performance/pages/PerformancePage/PerformancePage';
import { ProfilePage } from '@/features/user/pages/ProfilePage/ProfilePage';
import { SettingsPage } from '@/features/user/pages/SettingsPage/SettingsPage';
import { HomePage } from '@/features/static/pages/HomePage';
import { AuthPage } from '@/features/auth/pages/AuthPage';
import { RegisterStep2 } from '@/features/auth/components/RegisterForm/RegisterStep2/RegisterStep2';
import { RegisterStep3 } from '@/features/auth/components/RegisterForm/RegisterStep3/RegisterStep3';

function AppRoutesContent() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    return (
        <Routes>

            <Route element={<PublicLayout />}>
                <Route path="/" element={
                    isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/home" />
                } />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route path="/register/info" element={<RegisterStep2 />} />
                <Route path="/register/template" element={<RegisterStep3 />} />
            </Route>


            <Route element={<PrivateLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/topics" element={<TopicsPage />} />
                <Route path="/topics/:id" element={<TopicDetailPage />} />
                <Route path="/cycle" element={<CyclePage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    );
}

export function AppRoutes() {
    return <AppRoutesContent />;
}