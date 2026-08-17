import { Sprout, MapPinned, CheckSquare, HeartPulse } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFarms } from '@/hooks/useFarms';

interface KpiItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  trend?: string;
  trendUp?: boolean;
}

export default function KpiStrip() {
  const { user } = useAuth();
  const { data, loading, error } = useFarms(user?.id);
  const farms = Array.isArray(data) ? data : [];

  const totalFarms = farms.length;
  const totalArea = farms.reduce((sum, farm) => sum + Number(farm.area || 0), 0);
  const averageHealth = farms.length
    ? Math.round(farms.reduce((sum, farm) => sum + Number(farm.health || 0), 0) / farms.length)
    : 0;
  const activeFarms = farms.filter((farm) => String(farm.status).toLowerCase() === 'active').length;

  const cards: KpiItem[] = [
    {
      icon: <Sprout size={20} className="text-brand-600" />,
      label: 'Total Farms',
      value: loading ? '—' : error ? '—' : `${totalFarms}`,
      sub: 'Active farms',
      trend: '+1 this season',
      trendUp: true,
    },
    {
      icon: <MapPinned size={20} className="text-sky-600" />,
      label: 'Total Area',
      value: loading ? '—' : error ? '—' : `${totalArea.toFixed(1)} ac`,
      sub: 'Under cultivation',
    },
    {
      icon: <HeartPulse size={20} className="text-emerald-600" />,
      label: 'Average Health',
      value: loading ? '—' : error ? '—' : `${averageHealth}%`,
      sub: 'Avg crop health',
      trend: '+3% vs last week',
      trendUp: true,
    },
    {
      icon: <CheckSquare size={20} className="text-amber-600" />,
      label: 'Active Farms',
      value: loading ? '—' : error ? '—' : `${activeFarms}`,
      sub: 'Currently active',
      trend: '2 high priority',
      trendUp: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white rounded-xl shadow-card p-5 flex flex-col gap-3 hover:shadow-hover transition-shadow"
        >
          {/* Icon + label */}
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-lg bg-gray-50 grid place-items-center flex-shrink-0">
              {c.icon}
            </div>
            {c.trend && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                  c.trendUp
                    ? 'bg-green-50 text-green-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {c.trend}
              </span>
            )}
          </div>

          {/* Value */}
          <div>
            <div className="font-display font-bold text-2xl text-ink-900 leading-none">
              {c.value}
            </div>
            <div className="text-xs text-ink-600 mt-1">{c.label}</div>
            <div className="text-[11px] text-ink-500 mt-0.5">{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
