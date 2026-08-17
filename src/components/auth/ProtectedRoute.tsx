import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Leaf } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-brand-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-brand-600 grid place-items-center animate-pulse">
            <Leaf size={26} className="text-white" />
          </div>
          <div className="text-sm font-semibold text-ink-600">Loading your farm…</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
