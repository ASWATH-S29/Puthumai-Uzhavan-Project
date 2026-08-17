import { CloudRain, Leaf, Wallet, Bot } from 'lucide-react';
import { notifications } from '@/data/dummyData';

const typeMeta: Record<string, { icon: React.ReactNode; dot: string }> = {
  weather: { icon: <CloudRain size={14} className="text-sky-600" />,   dot: 'bg-sky-400' },
  crop:    { icon: <Leaf      size={14} className="text-brand-600" />, dot: 'bg-brand-400' },
  expense: { icon: <Wallet    size={14} className="text-amber-600" />, dot: 'bg-amber-400' },
  ai:      { icon: <Bot       size={14} className="text-purple-600" />,dot: 'bg-purple-400' },
};

export default function RecentActivities() {
  return (
    <div className="bg-white rounded-xl shadow-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
          Recent Activity
        </div>
        <button className="text-xs font-semibold text-brand-600 hover:text-brand-700">
          Mark all read
        </button>
      </div>

      <ul className="space-y-0">
        {notifications.map((n, i) => {
          const meta = typeMeta[n.type] ?? typeMeta.ai;
          const isLast = i === notifications.length - 1;
          return (
            <li key={n.id} className="flex gap-3">
              {/* Timeline line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`h-7 w-7 rounded-full bg-gray-50 border border-gray-100 grid place-items-center`}>
                  {meta.icon}
                </div>
                {!isLast && <div className="w-px flex-1 bg-gray-100 my-1" />}
              </div>

              {/* Content */}
              <div className={`pb-4 flex-1 min-w-0 ${isLast ? '' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-semibold text-ink-900 leading-snug">{n.title}</div>
                  <span className="text-[10px] text-ink-500 whitespace-nowrap flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-[11px] text-ink-600 mt-0.5 leading-snug">{n.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
