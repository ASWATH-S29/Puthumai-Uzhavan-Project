import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Leaf, ChevronLeft, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Icon from '@/components/ui/Icon';
import { sidebarNav } from '@/data/navData';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onClose }: SidebarProps) {
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'Farmer';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{ width: collapsed ? 68 : 252 }}
        className={`
          fixed lg:sticky top-0 z-40 h-screen flex-shrink-0
          transition-[width,transform] duration-300
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full bg-white border-r border-gray-100 flex flex-col overflow-hidden">

          {/* ── Logo bar ── */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
            {collapsed ? (
              <div className="mx-auto h-9 w-9 rounded-lg bg-brand-600 grid place-items-center">
                <Leaf size={18} className="text-white" strokeWidth={2.5} />
              </div>
            ) : (
              <Logo size="sm" />
            )}

            {/* Mobile close */}
            <button
              onClick={onClose}
              className="lg:hidden grid place-items-center h-9 w-9 rounded-lg text-ink-600 hover:bg-gray-50 transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>

            {/* Desktop collapse */}
            <button
              onClick={onToggle}
              className="hidden lg:grid place-items-center h-9 w-9 rounded-lg text-ink-600 hover:bg-gray-50 transition-colors flex-shrink-0"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft
                size={16}
                className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* ── Navigation ── */}
          <nav className="flex-1 overflow-y-auto scrollbar-none py-3 px-2 space-y-0.5">
            {sidebarNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[42px]
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      name={item.icon}
                      size={18}
                      className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-ink-500'}`}
                    />
                    {!collapsed && (
                      <span className="truncate leading-snug">{item.label}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── User footer ── */}
          <div className="border-t border-gray-100 p-2 flex-shrink-0">
            {!collapsed && (
              <div className="flex items-center gap-3 px-3 py-2 mb-1">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-brand-600 grid place-items-center text-white font-bold text-xs flex-shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-900 truncate">{displayName}</div>
                  <div className="text-[11px] text-ink-600 truncate">{user?.email}</div>
                </div>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600
                hover:bg-red-50 hover:text-red-600 transition-colors min-h-[42px]
                ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut size={18} className="flex-shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
