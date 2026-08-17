import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { expenseByCategory, expenses } from '@/data/dummyData';

const total = expenses.reduce((s, e) => s + e.amount, 0);

export default function ExpenseCard() {
  return (
    <GlassCard padding="lg" className="h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-brand-600">Expense Summary</div>
          <div className="text-sm text-ink-800/50 mt-0.5">This season</div>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-brand-100 grid place-items-center">
          <Wallet size={18} className="text-brand-700" />
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="font-display font-extrabold text-3xl text-ink-900">₹{total.toLocaleString('en-IN')}</span>
        <span className="text-xs font-semibold text-error-600 mb-1 flex items-center gap-0.5">
          <TrendingUp size={12} className="rotate-180" /> 6%
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="h-36 w-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseByCategory}
                dataKey="value"
                innerRadius={38}
                outerRadius={60}
                paddingAngle={3}
                stroke="none"
              >
                {expenseByCategory.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 }}
                formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-1.5">
          {expenseByCategory.map((e) => (
            <div key={e.name} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <span className="text-ink-800/70 flex-1 truncate">{e.name}</span>
              <span className="font-bold text-ink-900">₹{(e.value / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
