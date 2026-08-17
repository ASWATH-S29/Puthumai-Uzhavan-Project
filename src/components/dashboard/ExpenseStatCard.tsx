import { useMemo } from 'react';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import { useExpensesContext } from '@/context/ExpenseContext';

export default function ExpenseStatCard() {
  const { expenses, loading } = useExpensesContext();

  const summary = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);

    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    const currentMonthTotal = expenses.filter((item) => item.date?.startsWith(currentMonth)).reduce((sum, item) => sum + item.amount, 0);
    const previousMonthTotal = expenses.filter((item) => item.date?.startsWith(previousMonth)).reduce((sum, item) => sum + item.amount, 0);
    const change = previousMonthTotal > 0 ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 0;

    const categories = Object.entries(expenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {})).map(([name, value], index) => ({
      name,
      value,
      color: ['#16a34a', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'][index % 5],
    })) as Array<{ name: string; value: number; color: string }>;

    const totalForBar = categories.reduce((sum, item) => sum + item.value, 0);
    return { total, change, categories, totalForBar, isUp: change > 0 };
  }, [expenses]);

  const topCategories = summary.categories.slice(0, 4);

  return (
    <div className="bg-white rounded-xl shadow-card p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
          Expense Summary
        </div>
        <div className="h-9 w-9 rounded-lg bg-amber-50 grid place-items-center">
          <Wallet size={16} className="text-amber-600" />
        </div>
      </div>

      {/* Total */}
      <div className="font-display font-bold text-3xl text-ink-900">
        {loading ? 'Loading…' : `₹${summary.total.toLocaleString('en-IN')}`}
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${summary.isUp ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {summary.isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {summary.isUp ? '+' : ''}{summary.change.toFixed(1)}%
        </span>
        <span className="text-[11px] text-ink-500">vs last month</span>
      </div>

      {/* Category breakdown */}
      <div className="mt-4 space-y-2.5 flex-1">
        {topCategories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-ink-700 font-medium">{cat.name}</span>
              <span className="text-xs font-semibold text-ink-900">
                ₹{cat.value.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${summary.totalForBar > 0 ? (cat.value / summary.totalForBar) * 100 : 0}%`,
                  background: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Budget */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-ink-500">Budget used</span>
        <span className="font-bold text-ink-900">81% of ₹85,000</span>
      </div>
    </div>
  );
}
