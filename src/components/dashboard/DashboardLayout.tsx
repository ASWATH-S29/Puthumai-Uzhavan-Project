import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import BottomNav from '@/components/dashboard/BottomNav';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout() {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>

      <BottomNav />
    </ProtectedRoute>
  );
}
