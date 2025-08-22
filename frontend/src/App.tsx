import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TripPlanningPage = lazy(() => import('@/pages/TripPlanningPage'));
const ChatTripPlanningPage = lazy(() => import('@/pages/ChatTripPlanningPage'));
const ChatDashboardPage = lazy(() => import('@/pages/ChatDashboardPage'));
const ChatTripDetailPage = lazy(() => import('@/pages/ChatTripDetailPage'));
const ChatLandingPage = lazy(() => import('@/pages/ChatLandingPage'));
const TripDetailPage = lazy(() => import('@/pages/TripDetailPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const UserSettingsPage = lazy(() => import('@/pages/UserSettingsPage'));
const AgentTestPage = lazy(() => import('@/pages/AgentTestPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/plan-trip" element={<TripPlanningPage />} />
          <Route path="/chat-plan" element={<ChatTripPlanningPage />} />
          <Route path="/chat-dashboard" element={<ChatDashboardPage />} />
          <Route path="/chat-trip/:id" element={<ChatTripDetailPage />} />
          <Route path="/trip/:id" element={<TripDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/test-agents" element={<AgentTestPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
