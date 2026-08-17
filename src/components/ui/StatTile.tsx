import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import Card from '@/components/ui/GlassCard';

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  trend?: { dir: 'up' | 'down'; value: string };
  accent?: string;
  delay?: number;
}

export default function StatTile({ icon: IconCmp, label, value, sub, trend, accent = 'bg-brand-50 text-brand-600', delay = 0 }: StatTileProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card padding="md" hover className="h-full">
        <div className="flex items-center justify-between">
          <div className={`h-11 w-11 rounded-lg ${accent} grid place-items-center`}>
            <IconCmp size={20} />
          </div>
          {trend && (
            <span className={`text-xs font-bold ${trend.dir === 'up' ? 'text-success-600' : 'text-error-600'}`}>
              {trend.dir === 'up' ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-600">{label}</div>
        <div className="font-display font-bold text-2xl text-ink-900 leading-tight">{value}</div>
        {sub && <div className="mt-1 text-[11px] text-ink-600">{sub}</div>}
      </Card>
    </motion.div>
  );
}
