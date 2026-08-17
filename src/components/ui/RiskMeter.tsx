import { motion } from 'framer-motion';

interface RiskMeterProps {
  score: number;
  level: 'Low' | 'Medium' | 'High';
  label?: string;
}

const levelColor: Record<string, string> = {
  Low: '#16a34a',
  Medium: '#f59e0b',
  High: '#ef4444',
};

const levelBg: Record<string, string> = {
  Low: 'bg-brand-50 text-brand-700 border-brand-100',
  Medium: 'bg-amber-50 text-amber-700 border-amber-100',
  High: 'bg-error-500/10 text-error-600 border-error-500/20',
};

export default function RiskMeter({ score, level, label = 'Risk Level' }: RiskMeterProps) {
  const color = levelColor[level];
  return (
    <div className="rounded-xl bg-brand-50 border border-brand-100 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-800/45">{label}</span>
        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg border ${levelBg[level]}`}>{level}</span>
      </div>
      <div className="mt-3 relative h-2.5 rounded-full bg-ink-900/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-ink-800/40">
        <span>0</span>
        <span className="font-bold" style={{ color }}>{score}/100</span>
        <span>100</span>
      </div>
    </div>
  );
}
