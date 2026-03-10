import { Routes, Route } from 'react-router-dom';
import { TopicsPage } from '@/features/topics/pages/TopicsPage';
import { TopicDetailPage } from '@/features/topics/pages/TopicDetailPage';
import { CyclePage } from '@/features/cycle/pages/CyclePage/CyclePage';
import { PerformancePage } from '@/features/performance/pages/PerformancePage/PerformancePage';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<TopicsPage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/topics/:id" element={<TopicDetailPage />} />
            <Route path="/cycle" element={<CyclePage />} />
            <Route path="/performance" element={<PerformancePage />} />
        </Routes>
    );
}