import { Link } from 'react-router-dom';
import { HeartPulse, ArrowRight } from 'lucide-react';
import { kpis, fields } from '@/data/dummyData';

const healthColor = (h: number) =>
  h >= 85 ? '#16a34a' : h >= 75 ? '#d97706' : '#ef4444';

export default function CropHealthScore() {
  const score = kpis.avgHealth;
  const radius = 48;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = healthColor(score);

  const healthy = fields.filter((f) => f.health >= 85).length;
  const watch   = fields.filter((f) => f.health >= 75 && f.health < 85).length;
  const risk    = fields.filter((f) => f.health < 75).length;

  return (
    <div className="bg-white rounded-xl shadow-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
          Crop Health
        </div>
        <div className="h-9 w-9 rounded-lg bg-green-50 grid place-items-center">
          <HeartPulse size={16} className="text-green-600" />
        </div>
      </div>

      {/* Donut */}
      <div className="flex items-center justify-center my-2">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="9" />
            <circle
              cx="55" cy="55" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-display font-extrabold text-3xl text-ink-900 leading-none">
                {score}
              </div>
              <div className="text-[10px] text-ink-500 mt-0.5">/ 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 text-center mt-2">
        {[
          { label: 'Healthy', value: healthy, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Watch',   value: watch,   color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'At Risk', value: risk,    color: 'text-red-600',   bg: 'bg-red-50'   },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg ${s.bg} py-2.5`}>
            <div className={`font-display font-bold text-xl ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-semibold text-ink-500 uppercase">{s.label}</div>
          </div>
        ))}
      </div>

      <Link
        to="/dashboard/crop-health"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-ink-700 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors"
      >
        View Details <ArrowRight size={12} />
      </Link>
    </div>
  );
}
