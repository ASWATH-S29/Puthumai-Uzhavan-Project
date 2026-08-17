import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin, CalendarRange, Sprout, Star, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/GlassCard';
import { farmerProfile } from '@/data/dummyData';

export default function FarmerProfileCard() {
  return (
    <Card padding="lg" className="h-full">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-brand-600 grid place-items-center text-white font-display font-bold text-xl flex-shrink-0">
          {farmerProfile.initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-bold text-lg text-ink-900 truncate">{farmerProfile.name}</h3>
            {farmerProfile.verified && <BadgeCheck size={16} className="text-brand-600 flex-shrink-0" />}
          </div>
          <div className="text-sm text-brand-700 font-semibold">{farmerProfile.plan}</div>
          <div className="flex items-center gap-1 text-xs text-ink-600 mt-0.5">
            <MapPin size={12} /> {farmerProfile.location}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
        {[
          { icon: Sprout, value: `${farmerProfile.activeFields}`, label: 'Fields' },
          { icon: CalendarRange, value: `${farmerProfile.seasonsCompleted}`, label: 'Seasons' },
          { icon: Star, value: farmerProfile.rating.toFixed(1), label: 'Rating' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-gray-50 py-3">
            <s.icon size={16} className="mx-auto text-brand-600" />
            <div className="mt-1.5 font-display font-bold text-lg text-ink-900">{s.value}</div>
            <div className="text-[10px] font-semibold text-ink-600 uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      <Link
        to="/dashboard/settings"
        className="mt-5 flex items-center justify-center gap-1.5 rounded-lg bg-brand-50 border border-brand-100 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 transition-colors"
      >
        View profile <ArrowRight size={15} />
      </Link>
    </Card>
  );
}
