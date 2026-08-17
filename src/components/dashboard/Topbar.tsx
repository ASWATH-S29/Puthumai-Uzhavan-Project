import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, Globe } from 'lucide-react';
import { sidebarNav } from '@/data/navData';
import { useAuth } from '@/context/AuthContext';

interface TopbarProps {
  onMenu: () => void;
}

export default function Topbar({ onMenu }: TopbarProps) {
  const { pathname } = useLocation();
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const current = sidebarNav.find(
    (s) => pathname === s.path || (s.path !== '/dashboard' && pathname.startsWith(s.path))
  );
  const pageTitle = current?.label ?? 'Dashboard';

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'Farmer';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const avatarUrl = profile?.avatar_url;

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex-shrink-0">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-16">

        {/* Mobile hamburger */}
        <button
          onClick={onMenu}
          className="lg:hidden grid place-items-center h-10 w-10 rounded-lg text-ink-700 hover:bg-gray-50 transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Page title */}
        <div className="flex-1 min-w-0 hidden lg:block">
          <h1 className="font-display font-bold text-xl text-ink-900 truncate">{pageTitle}</h1>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 w-48 sm:w-64 border border-gray-100">
          <Search size={14} className="text-ink-500 flex-shrink-0" />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-ink-400 text-ink-900 min-w-0"
          />
        </div>

        {/* Language toggle */}
        <button
          className="hidden sm:grid place-items-center h-10 w-10 rounded-lg text-ink-600 hover:bg-gray-50 border border-gray-100 transition-colors"
          aria-label="Language"
        >
          <Globe size={17} />
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/dashboard')}
          className="relative grid place-items-center h-10 w-10 rounded-lg text-ink-600 hover:bg-gray-50 border border-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="flex items-center gap-2.5 rounded-lg hover:bg-gray-50 border border-gray-100 px-2.5 py-1.5 transition-colors"
          aria-label="Profile"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <div className="h-7 w-7 rounded-full bg-brand-600 grid place-items-center text-white font-bold text-xs flex-shrink-0">
              {initials}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-ink-900 leading-tight">{displayName}</div>
            <div className="text-[10px] text-ink-500 leading-tight">Farm Owner</div>
          </div>
        </button>

      </div>
    </header>
  );
}
