import { TrendingUp, Receipt } from 'lucide-react';
import Card from '@/components/ui/GlassCard';
import { finance } from '@/data/dummyData';

export default function RevenueCard() {
  const change = ((finance.expectedRevenue - finance.revenueLastMonth) / finance.revenueLastMonth) * 100;
  const sparkPoints = [84, 88, 80, 96, 100, 112, 124, 138];
  const max = Math.max(...sparkPoints);
  const path = sparkPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (sparkPoints.length - 1)) * 100} ${100 - (p / max) * 90}`)
    .join(' ');

  return (
    <Card padding="lg" className="h-full">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-widest text-brand-600">Expected Revenue</div>
        <div className="h-10 w-10 rounded-lg bg-sky-50 grid place-items-center">
          <Receipt size={18} className="text-sky-600" />
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="font-display font-bold text-3xl text-ink-900">₹{finance.expectedRevenue.toLocaleString('en-IN')}</span>
      </div>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-green-50 text-success-600 px-2 py-0.5 text-xs font-bold">
          <TrendingUp size={12} /> +{change.toFixed(1)}%
        </span>
        <span className="text-xs text-ink-600">vs last month</span>
      </div>

      <div className="mt-4 h-14">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <path
            d={`${path} L 100 100 L 0 100 Z`}
            fill="#0284c7"
            fillOpacity="0.08"
          />
          <path
            d={path}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div>
          <div className="text-ink-600">Per acre</div>
          <div className="font-bold text-ink-900">₹12,432</div>
        </div>
        <div className="text-right">
          <div className="text-ink-600">Projected</div>
          <div className="font-bold text-ink-900">Aug</div>
        </div>
      </div>
    </Card>
  );
}
