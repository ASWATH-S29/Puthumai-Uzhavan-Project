export const sidebarNav = [
  { label: 'Dashboard',           icon: 'LayoutDashboard', path: '/dashboard' },
  { label: 'My Farm',             icon: 'MapPinned',        path: '/dashboard/farm-profile' },
  { label: 'Farm Memory',         icon: 'Brain',            path: '/dashboard/farmer-memory' },
  { label: 'Smart Alerts',        icon: 'Bell',             path: '/dashboard/alerts' },
  { label: 'Weather',             icon: 'CloudSun',         path: '/dashboard/weather' },
  { label: 'Crop Recommendation', icon: 'Sprout',           path: '/dashboard/crops' },
  { label: 'Crop Health',         icon: 'HeartPulse',       path: '/dashboard/crop-health' },
  { label: 'Gov. Schemes',        icon: 'Building2',        path: '/dashboard/schemes' },
  { label: 'Marketplace',         icon: 'ShoppingBag',      path: '/dashboard/marketplace' },
  { label: 'Expense Tracker',     icon: 'Wallet',           path: '/dashboard/expenses' },
  { label: 'Analytics',           icon: 'BarChart3',        path: '/dashboard/analytics' },
  { label: 'AI Assistant',        icon: 'Bot',              path: '/dashboard/chatbot' },
  { label: 'Yield Prediction',    icon: 'TrendingUp',       path: '/dashboard/yield-prediction' },
  { label: 'Season Report',       icon: 'FileText',         path: '/dashboard/season-report' },
  { label: 'Profile',             icon: 'UserCircle',       path: '/dashboard/profile' },
  { label: 'Settings',            icon: 'Settings',         path: '/dashboard/settings' },
] as const;

export const bottomNav = [
  { label: 'Home',    icon: 'LayoutDashboard', path: '/dashboard' },
  { label: 'Crops',   icon: 'Sprout',          path: '/dashboard/crops' },
  { label: 'AI',      icon: 'Bot',             path: '/dashboard/chatbot' },
  { label: 'Alerts',  icon: 'Bell',            path: '/dashboard/alerts' },
  { label: 'Profile', icon: 'UserCircle',      path: '/dashboard/profile' },
] as const;
