import { useMemo } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useExpensesContext } from '@/context/ExpenseContext';

const tooltipStyle = {
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  fontSize: 11,
  padding: '6px 10px',
};

export default function ChartsSection() {
  const { expenses } = useExpensesContext();

  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }).map((_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const amount = expenses.filter((item) => item.date?.startsWith(monthKey)).reduce((sum, item) => sum + item.amount, 0);
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        expenses: amount,
      };
    });
  }, [expenses]);

  const categoryData = useMemo(() => Object.entries(expenses.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {})).map(([name, value]) => ({ name, value })), [expenses]);

  return (
    <div className="grid lg:grid-cols-2 gap-4">

      {/* Income vs Expense */}
      <div className="bg-white rounded-xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              Income vs Expense
            </div>
            <div className="text-xs text-ink-600 mt-0.5">Last 6 months (₹)</div>
          </div>
          <div className="flex items-center gap-1 h-8 w-8 rounded-lg bg-green-50 place-items-center justify-center">
            <BarChart3 size={15} className="text-green-600" />
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => `₹${Number(v ?? 0).toLocaleString('en-IN')}`}
              />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} iconType="circle" />
              <Bar dataKey="expenses" fill="#2e7d32" radius={[4, 4, 0, 0]} name="Expenses" maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Summary */}
      <div className="bg-white rounded-xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              Expense Summary
            </div>
            <div className="text-xs text-ink-600 mt-0.5">Actual vs AI predicted (kg)</div>
          </div>
          <div className="flex items-center gap-1 h-8 w-8 rounded-lg bg-brand-50 place-items-center justify-center">
            <TrendingUp size={15} className="text-brand-600" />
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${Number(v ?? 0).toLocaleString('en-IN')}`} />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Category spend" maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
