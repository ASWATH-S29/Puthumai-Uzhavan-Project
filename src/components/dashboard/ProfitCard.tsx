import { TrendingUp, IndianRupee } from 'lucide-react';
import Card from '@/components/ui/GlassCard';
import { profit } from '@/data/dummyData';

export default function ProfitCard() {
  const change = ((profit.thisMonth - profit.lastMonth) / profit.lastMonth) * 100;
  const sparkPoints = [40, 55, 48, 62, 70, 85];
  const max = Math.max(...sparkPoints);
  const path = sparkPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (sparkPoints.length - 1)) * 100} ${100 - (p / max) * 90}`)
    .join(' ');

  return (
    <Card padding="lg" className="h-full">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-600">Profit · This Month</div>
        <div className="h-10 w-10 rounded-lg bg-green-50 grid place-items-center">
          <IndianRupee size={18} className="text-success-600" />
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="font-display font-bold text-3xl text-ink-900">₹{profit.thisMonth.toLocaleString('en-IN')}</span>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-green-50 text-success-600 px-2 py-0.5 text-xs font-bold">
          <TrendingUp size={12} /> +{change.toFixed(1)}%
        </span>
        <span className="text-xs text-ink-600">vs ₹{profit.lastMonth.toLocaleString('en-IN')} last month</span>
      </div>

      <div className="mt-4 h-14">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <path d={`${path} L 100 100 L 0 100 Z`} fill="#22c55e" fillOpacity="0.08" />
          <path d={path} fill="none" stroke="#16a34a" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div>
          <div className="text-ink-600">Margin</div>
          <div className="font-bold text-ink-900">{profit.margin}%</div>
        </div>
        <div className="text-right">
          <div className="text-ink-600">Per acre</div>
          <div className="font-bold text-ink-900">₹{profit.perAcre.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </Card>
  );
}
