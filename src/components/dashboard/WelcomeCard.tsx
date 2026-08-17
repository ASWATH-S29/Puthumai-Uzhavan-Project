import { useAuth } from '@/context/AuthContext';
import { CalendarDays, MapPin } from 'lucide-react';

export default function WelcomeCard() {
  const { profile, user } = useAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'Farmer';
  const firstName = displayName.split(' ')[0];

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const location = profile?.village
    ? `${profile.village}, ${profile?.state ?? 'India'}`
    : 'Thanjavur, Tamil Nadu';

  return (
    <div className="bg-brand-600 rounded-xl p-5 sm:p-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-brand-200 text-sm font-medium">{greeting} 🌿</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mt-1">
            {firstName}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-2.5">
            <span className="flex items-center gap-1.5 text-brand-100 text-xs">
              <CalendarDays size={13} />
              {today}
            </span>
            <span className="flex items-center gap-1.5 text-brand-100 text-xs">
              <MapPin size={13} />
              {location}
            </span>
          </div>
        </div>
        {/* Decorative crop emoji badge */}
        <div className="hidden sm:flex h-16 w-16 rounded-full bg-white/10 items-center justify-center text-4xl flex-shrink-0">
          🌾
        </div>
      </div>

      {/* Status pill */}
      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
        4 fields active · 2 AI alerts today
      </div>
    </div>
  );
}
