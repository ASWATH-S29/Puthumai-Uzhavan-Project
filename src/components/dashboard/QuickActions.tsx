import { Link } from 'react-router-dom';
import Card from '@/components/ui/GlassCard';
import Icon from '@/components/ui/Icon';
import { quickActions } from '@/data/quickActions';

export default function QuickActions() {
  return (
    <Card padding="lg" className="h-full">
      <div className="text-xs font-bold uppercase tracking-widest text-brand-600">Quick Actions</div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            to={a.path}
            className="flex h-full flex-col rounded-lg border border-gray-100 p-4 hover:border-brand-200 hover:shadow-soft transition-all"
          >
            <div className={`h-11 w-11 rounded-lg grid place-items-center ${a.color}`}>
              <Icon name={a.icon} size={20} />
            </div>
            <div className="mt-3 text-sm font-semibold text-ink-900 leading-tight">{a.label}</div>
            <div className="text-[11px] text-ink-600 mt-0.5">{a.hint}</div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
