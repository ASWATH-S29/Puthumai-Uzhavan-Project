export const quickActions = [
  { label: 'Scan Crop', hint: 'AI pest check', icon: 'Camera', path: '/crop-health', color: 'text-brand-600 bg-brand-50' },
  { label: 'AI Assistant', hint: 'Ask anything', icon: 'Bot', path: '/chatbot', color: 'text-accent-600 bg-accent-50' },
  { label: 'Add Expense', hint: 'Track spending', icon: 'Wallet', path: '/expenses', color: 'text-warning-600 bg-amber-50' },
  { label: 'Check Weather', hint: '7-day forecast', icon: 'CloudSun', path: '/weather', color: 'text-sky-600 bg-sky-50' },
  { label: 'Yield Forecast', hint: 'Predict harvest', icon: 'TrendingUp', path: '/yield-prediction', color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Season Report', hint: 'View report', icon: 'CalendarRange', path: '/season-report', color: 'text-violet-600 bg-violet-50' },
] as const;