import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { RecommendationProvider } from '@/context/RecommendationContext';
import { ToastProvider } from '@/components/ui/Toast';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Leaf } from 'lucide-react';

const LandingPage            = lazy(() => import('@/pages/LandingPage'));
const LoginPage              = lazy(() => import('@/pages/LoginPage'));
const RegisterPage           = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage     = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage      = lazy(() => import('@/pages/ResetPasswordPage'));
const DashboardLayout        = lazy(() => import('@/components/dashboard/DashboardLayout'));
const DashboardHome          = lazy(() => import('@/pages/app/DashboardHome'));
const FarmProfilePage        = lazy(() => import('@/pages/app/FarmProfilePage'));
const ProfilePage            = lazy(() => import('@/pages/app/ProfilePage'));
const WeatherPage            = lazy(() => import('@/pages/app/WeatherPage'));
const CropRecommendationPage = lazy(() => import('@/pages/app/CropRecommendationPage'));
const ExpenseTrackerPage     = lazy(() => import('@/pages/app/ExpenseTrackerPage'));
const AnalyticsPage          = lazy(() => import('@/pages/app/AnalyticsPage'));
const AIAssistantPage        = lazy(() => import('@/pages/app/AIAssistantPage'));
const CropHealthPage         = lazy(() => import('@/pages/app/CropHealthPage'));
const YieldPredictionPage    = lazy(() => import('@/pages/app/YieldPredictionPage'));
const SeasonReportPage       = lazy(() => import('@/pages/app/SeasonReportPage'));
const SettingsPage           = lazy(() => import('@/pages/app/SettingsPage'));
const AdminPanelPage         = lazy(() => import('@/pages/app/AdminPanelPage'));
const GovSchemesPage         = lazy(() => import('@/pages/app/GovSchemesPage'));
const MarketplacePage        = lazy(() => import('@/pages/app/MarketplacePage'));
// v2.0 new pages
const FarmerMemoryPage       = lazy(() => import('@/pages/app/FarmerMemoryPage'));
const FarmingAlertsPage      = lazy(() => import('@/pages/app/FarmingAlertsPage'));

function PageLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-brand-600 grid place-items-center animate-pulse">
          <Leaf size={22} className="text-white" />
        </div>
        <div className="text-sm font-semibold text-ink-600">Loading…</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ExpenseProvider>
            <RecommendationProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* public */}
                <Route path="/"                   element={<LandingPage />} />
                <Route path="/login"              element={<LoginPage />} />
                <Route path="/signup"             element={<RegisterPage />} />
                <Route path="/register"           element={<Navigate to="/signup" replace />} />
                <Route path="/forgot-password"    element={<ForgotPasswordPage />} />
                <Route path="/reset-password"     element={<ResetPasswordPage />} />

                {/* protected dashboard — /dashboard/* and /app/* both work */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index                    element={<DashboardHome />} />
                  <Route path="profile"           element={<ProfilePage />} />
                  <Route path="weather"           element={<WeatherPage />} />
                  <Route path="crops"             element={<CropRecommendationPage />} />
                  <Route path="expenses"          element={<ExpenseTrackerPage />} />
                  <Route path="analytics"         element={<AnalyticsPage />} />
                  <Route path="chatbot"           element={<AIAssistantPage />} />
                  <Route path="crop-health"       element={<CropHealthPage />} />
                  <Route path="yield-prediction"  element={<YieldPredictionPage />} />
                  <Route path="season-report"     element={<SeasonReportPage />} />
                  <Route path="farm-profile"      element={<FarmProfilePage />} />
                  <Route path="settings"          element={<SettingsPage />} />
                  <Route path="admin"             element={<AdminPanelPage />} />
                  <Route path="schemes"           element={<GovSchemesPage />} />
                  <Route path="marketplace"       element={<MarketplacePage />} />
                  {/* v2.0 routes */}
                  <Route path="farmer-memory"     element={<FarmerMemoryPage />} />
                  <Route path="alerts"            element={<FarmingAlertsPage />} />
                </Route>

                {/* /app/* redirects */}
                <Route path="/app" element={<Navigate to="/dashboard" replace />} />
                <Route path="/app/farmer-memory" element={<Navigate to="/dashboard/farmer-memory" replace />} />
                <Route path="/app/alerts"        element={<Navigate to="/dashboard/alerts" replace />} />
                <Route path="/app/*"             element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
            </RecommendationProvider>
            </ExpenseProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
