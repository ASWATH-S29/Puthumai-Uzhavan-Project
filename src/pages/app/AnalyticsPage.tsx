import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, IndianRupee, Percent, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import StatTile from '@/components/ui/StatTile';
import { profitTrend, expenseByCategory } from '@/data/dummyData';

const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 };

const revenue = 186000;
const expenses = 98000;
const profit = revenue - expenses;
const roi = ((profit / expenses) * 100).toFixed(1);

const profitByMonth = profitTrend.map((p) => ({
  month: p.month,
  revenue: p.revenue,
  cost: p.cost,
  profit: p.revenue - p.cost,
}));

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader icon={BarChart3} title="Analytics" subtitle="Revenue, expenses, profit, and ROI across the season." />

      {/* stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={IndianRupee} label="Total Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} trend={{ dir: 'up', value: '12%' }} accent="bg-brand-600" />
        <StatTile icon={Wallet} label="Total Expenses" value={`₹${expenses.toLocaleString('en-IN')}`} trend={{ dir: 'down', value: '4%' }} accent="bg-amber-600" delay={0.06} />
        <StatTile icon={TrendingUp} label="Net Profit" value={`₹${profit.toLocaleString('en-IN')}`} trend={{ dir: 'up', value: '18%' }} accent="bg-emerald-600" delay={0.12} />
        <StatTile icon={Percent} label="ROI" value={`${roi}%`} sub="return on investment" accent="bg-accent-600" delay={0.18} />
      </div>

      {/* profit trend area chart */}
      <GlassCard padding="lg">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center"><TrendingUp size={17} className="text-brand-700" /></div>
          <div>
            <div className="font-display font-bold text-ink-900">Profit Trend</div>
            <div className="text-xs text-ink-600">Revenue vs cost over the season (₹)</div>
          </div>
        </div>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitByMonth} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ea" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
              <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2.5} fill="url(#costGrad)" name="Cost" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* monthly profit bar chart */}
        <GlassCard padding="lg" className="lg:col-span-3">
          <div className="font-display font-bold text-ink-900">Monthly Profit</div>
          <div className="text-xs text-ink-600 mt-0.5">Net profit per month (₹)</div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitByMonth} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ea" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} cursor={{ fill: 'rgba(34,197,94,0.06)' }} />
                <Bar dataKey="profit" radius={[8, 8, 0, 0]} name="Profit">
                  {profitByMonth.map((p, i) => (
                    <Cell key={i} fill={p.profit >= 0 ? '#16a34a' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* expense distribution pie */}
        <GlassCard padding="lg" className="lg:col-span-2">
          <div className="font-display font-bold text-ink-900">Expense Distribution</div>
          <div className="text-xs text-ink-600 mt-0.5">By category this season</div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={3} stroke="none">
                  {expenseByCategory.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1.5">
            {expenseByCategory.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />
                  <span className="text-ink-800/65">{e.name}</span>
                </div>
                <span className="font-bold text-ink-900">₹{e.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* monthly summary */}
      <GlassCard padding="lg">
        <div className="font-display font-bold text-ink-900 mb-4">Monthly Summary</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-ink-600 border-b border-gray-100">
                <th className="pb-3 pr-4">Month</th>
                <th className="pb-3 pr-4 text-right">Revenue</th>
                <th className="pb-3 pr-4 text-right">Expenses</th>
                <th className="pb-3 pr-4 text-right">Profit</th>
                <th className="pb-3 text-right">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/5">
              {profitByMonth.map((m, i) => {
                const margin = m.revenue > 0 ? ((m.profit / m.revenue) * 100).toFixed(1) : '0';
                return (
                  <motion.tr key={m.month} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className="hover:bg-brand-50/40 transition-colors">
                    <td className="py-3 pr-4 font-bold text-ink-900">{m.month}</td>
                    <td className="py-3 pr-4 text-right text-ink-900">₹{m.revenue.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4 text-right text-ink-600">₹{m.cost.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4 text-right font-bold text-brand-600">₹{m.profit.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 font-bold text-xs ${m.profit >= 0 ? 'text-brand-600' : 'text-error-600'}`}>
                        {m.profit >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {margin}%
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
