import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Plus, TrendingUp, TrendingDown, Pencil, Trash2, Calculator, IndianRupee, Search, Loader2 } from 'lucide-react';
import { useFarms } from '@/hooks/useFarms';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import StatTile from '@/components/ui/StatTile';
import Modal from '@/components/ui/Modal';
import FormField from '@/components/ui/FormField';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { useExpensesContext } from '@/context/ExpenseContext';
import type { AddExpenseRequest, ExpenseRow } from '@/services/types';

const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 };
const expenseCategories = ['Seeds', 'Fertilizer', 'Pesticide', 'Labor', 'Machinery', 'Fuel', 'Transport', 'Water', 'Electricity', 'Other'];

const emptyForm = { date: '', category: '', amount: '', farmId: '', notes: '' };

export default function ExpenseTrackerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { expenses, loading, error, createExpense, updateExpenseItem, deleteExpenseItem } = useExpensesContext();
  const { data } = useFarms(user?.id);
  const farms = data ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [estRevenue, setEstRevenue] = useState('186000');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [farmFilter, setFarmFilter] = useState('All');
  const [dateRange, setDateRange] = useState('All');
  const [formError, setFormError] = useState<string | null>(null);

  const rows = useMemo(() => expenses.map((expense) => ({
    ...expense,
    farm_name: farms.find((farm) => farm.id === expense.farm_id)?.name ?? expense.farm_name ?? 'Farm',
  })), [expenses, farms]);
  const total = rows.reduce((s, r) => s + r.amount, 0);
  const today = new Date().toISOString().slice(0, 10);
  const todaysExpenses = rows.filter((row) => row.date === today).reduce((sum, row) => sum + row.amount, 0);
  const monthlyExpenses = rows.filter((row) => row.date && row.date.startsWith(new Date().toISOString().slice(0, 7))).reduce((sum, row) => sum + row.amount, 0);
  const categoryTotals = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + row.amount;
    return acc;
  }, {});
  const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None';
  const highestCategoryValue = categoryTotals[highestCategory] ?? 0;
  const estProfit = Number(estRevenue) - total;
  const roi = total > 0 ? ((estProfit / total) * 100).toFixed(1) : '0';

  const uniqueFarms = useMemo(() => Array.from(new Set(rows.map((row) => row.farm_name).filter(Boolean))).sort(), [rows]);
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !query || [row.category, row.notes ?? '', row.farm_name ?? '', row.description ?? ''].join(' ').toLowerCase().includes(query);
      const matchesCategory = categoryFilter === 'All' || row.category === categoryFilter;
      const matchesFarm = farmFilter === 'All' || row.farm_name === farmFilter;
      const matchesDate = dateRange === 'All' || (row.date && row.date.includes(dateRange));
      return matchesSearch && matchesCategory && matchesFarm && matchesDate;
    });
  }, [categoryFilter, dateRange, farmFilter, rows, search]);

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  const monthlyChartData = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const amount = rows.filter((row) => row.date && row.date.startsWith(monthKey)).reduce((sum, item) => sum + item.amount, 0);
    return { month, amount };
  });

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const openAdd = () => {
    setFormError(null);
    setForm(emptyForm);
    setEditId(null);
    setModalOpen(true);
  };

  const openEdit = (row: ExpenseRow) => {
    setFormError(null);
    setForm({ date: row.date, category: row.category, amount: String(row.amount), farmId: row.farm_id ?? '', notes: row.notes ?? '' });
    setEditId(row.id);
    setModalOpen(true);
  };

  const save = async () => {
    if (!user?.id) {
      toast('Please sign in to save expenses.', 'error');
      return;
    }

    const amount = Number(form.amount);
    const category = form.category.trim();
    const date = form.date.trim();
    if (!category || !date || !Number.isFinite(amount) || amount <= 0) {
      setFormError('Please complete the date, category, and amount fields.');
      return;
    }

    const payload: AddExpenseRequest = {
      date,
      category,
      amount,
      farm_id: form.farmId || undefined,
      notes: form.notes.trim() || undefined,
      user_id: user.id,
    };

    try {
      setFormError(null);
      if (editId) {
        await updateExpenseItem(editId, payload);
        toast('Expense updated successfully', 'success');
      } else {
        await createExpense(payload);
        toast('Expense added successfully', 'success');
      }
      setModalOpen(false);
      setEditId(null);
      setForm(emptyForm);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Unable to save expense', 'error');
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpenseItem(id);
      toast('Expense deleted', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Unable to delete expense', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Wallet} title="Expense Tracker" subtitle="Track every input cost and watch your margins per acre." action={{ label: 'Add expense', icon: Plus, onClick: openAdd }} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={Wallet} label="Total Expenses" value={`₹${total.toLocaleString('en-IN')}`} trend={{ dir: 'down', value: '6%' }} accent="bg-brand-600" />
        <StatTile icon={TrendingDown} label="Monthly Expenses" value={`₹${monthlyExpenses.toLocaleString('en-IN')}`} sub={`This month`} accent="bg-amber-600" delay={0.06} />
        <StatTile icon={TrendingUp} label="Today's Expenses" value={`₹${todaysExpenses.toLocaleString('en-IN')}`} sub="Today" accent="bg-accent-600" delay={0.12} />
        <StatTile icon={Wallet} label="Highest Category" value={highestCategory} sub={`₹${highestCategoryValue.toLocaleString('en-IN')}`} accent="bg-emerald-600" delay={0.18} />
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <GlassCard padding="lg" className="lg:col-span-3">
          <div className="font-display font-bold text-ink-900">Monthly Expense Chart</div>
          <div className="text-xs text-ink-600 mt-0.5">Last 6 months trend (₹)</div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyChartData} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ea" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
                <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: '#16a34a' }} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard padding="lg" className="lg:col-span-2">
          <div className="font-display font-bold text-ink-900">Category Pie Chart</div>
          <div className="text-xs text-ink-600 mt-0.5">Share of total spend</div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={3} stroke="none">
                  {chartData.map((e, index) => <Cell key={e.name} fill={['#16a34a', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#14b8a6', '#f97316', '#0ea5e9', '#84cc16', '#64748b'][index % 10]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {chartData.map((e, index) => (
              <div key={e.name} className="flex items-center gap-1.5 text-[11px]">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: ['#16a34a', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#14b8a6', '#f97316', '#0ea5e9', '#84cc16', '#64748b'][index % 10] }} />
                <span className="text-ink-800/65 truncate">{e.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <GlassCard padding="lg" className="lg:col-span-3">
          <div className="font-display font-bold text-ink-900">Farm-wise Expense Bar Chart</div>
          <div className="text-xs text-ink-600 mt-0.5">Expenses grouped by farm</div>
          <div className="mt-5 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uniqueFarms.map((farm) => ({ farm, value: rows.filter((row) => row.farm_name === farm).reduce((sum, item) => sum + item.amount, 0) }))} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ea" vertical={false} />
                <XAxis dataKey="farm" tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} cursor={{ fill: 'rgba(34,197,94,0.06)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard padding="lg" className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-brand-600" />
            <div className="font-display font-bold text-ink-900">Profit Estimator</div>
          </div>
          <div className="mt-4">
            <FormField label="Expected Revenue (₹)" name="estRevenue" type="number" value={estRevenue} onChange={setEstRevenue} placeholder="0" icon={<IndianRupee size={15} />} />
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-brand-50 border border-gray-100 p-3">
              <span className="text-sm text-ink-600">Total Investment</span>
              <span className="font-bold text-ink-900">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className={`flex items-center justify-between rounded-2xl p-3 border ${estProfit >= 0 ? 'bg-brand-50 border-brand-100' : 'bg-error-500/10 border-error-500/20'}`}>
              <span className="text-sm font-semibold text-ink-800/70">Net Profit</span>
              <span className={`font-display font-extrabold text-lg ${estProfit >= 0 ? 'text-brand-700' : 'text-error-600'}`}>₹{estProfit.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-brand-50 border border-brand-100 p-3">
              <span className="text-sm font-semibold text-ink-800/70">ROI</span>
              <span className="font-display font-extrabold text-lg text-brand-700">{roi}%</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard padding="lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="font-display font-bold text-ink-900">Expense List</div>
            <span className="text-xs text-ink-600">{filteredRows.length} entries</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-800/35" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search farm, category, notes" className="w-full rounded-xl bg-brand-50 border border-brand-100 pl-9 pr-4 py-3 text-sm text-ink-900 outline-none" />
            </div>
            <FormField label="Category" name="categoryFilter" variant="select" value={categoryFilter} onChange={setCategoryFilter} options={['All', ...expenseCategories]} placeholder="All categories" />
            <FormField label="Farm" name="farmFilter" variant="select" value={farmFilter} onChange={setFarmFilter} options={['All', ...uniqueFarms]} placeholder="All farms" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Date range" name="dateRange" value={dateRange} onChange={setDateRange} placeholder="All dates" />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-ink-600"><Loader2 size={16} className="animate-spin" /> Loading expenses…</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : filteredRows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-ink-600">
              <div className="font-semibold text-ink-900">No expenses added</div>
              <p className="mt-2">Add your first expense to begin tracking costs and margins.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-ink-600 border-b border-gray-100">
                  <th className="pb-3 pr-4 font-bold">Date</th>
                  <th className="pb-3 pr-4 font-bold">Category</th>
                  <th className="pb-3 pr-4 font-bold hidden sm:table-cell">Farm</th>
                  <th className="pb-3 pr-4 font-bold hidden md:table-cell">Notes</th>
                  <th className="pb-3 pr-4 font-bold text-right">Amount</th>
                  <th className="pb-3 pl-2 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                <AnimatePresence>
                  {filteredRows.map((r) => (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="hover:bg-brand-50/40 transition-colors group">
                      <td className="py-3 pr-4 text-ink-600 whitespace-nowrap">{r.date}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-lg bg-brand-50 border border-brand-100 px-2 py-1 text-[11px] font-bold text-brand-700">{r.category}</span>
                      </td>
                      <td className="py-3 pr-4 text-ink-900 hidden sm:table-cell">{r.farm_name ?? r.field}</td>
                      <td className="py-3 pr-4 text-ink-800/55 hidden md:table-cell">{r.notes || r.description}</td>
                      <td className="py-3 pr-4 text-right font-bold text-ink-900 whitespace-nowrap">₹{r.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 pl-2">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(r)} className="grid place-items-center h-8 w-8 rounded-lg bg-brand-50 border border-gray-100 text-ink-800/55 hover:text-brand-700 hover:border-brand-200 transition-colors" aria-label="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => remove(r.id)} className="grid place-items-center h-8 w-8 rounded-lg bg-brand-50 border border-gray-100 text-ink-800/55 hover:text-error-600 hover:border-error-500/30 transition-colors" aria-label="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Expense' : 'Add Expense'} subtitle="Track a new input cost" footer={
        <>
          <button onClick={() => setModalOpen(false)} className="rounded-2xl bg-white border border-gray-100 px-5 py-2.5 text-sm font-semibold text-ink-800/70 hover:bg-ink-900/5 transition-colors">Cancel</button>
          <button onClick={save} className="rounded-2xl bg-brand-600 text-white px-5 py-2.5 text-sm font-bold shadow-card hover:bg-brand-700 transition-colors">{editId ? 'Save changes' : 'Add expense'}</button>
        </>
      }>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Date" name="date" value={form.date} onChange={set('date')} placeholder="YYYY-MM-DD" />
          <FormField label="Category" name="category" variant="select" value={form.category} onChange={set('category')} options={expenseCategories} required />
          <div>
            <label htmlFor="farm" className="text-[11px] font-bold uppercase tracking-wider text-ink-800/50 mb-1.5 flex items-center gap-1">Farm</label>
            <select id="farm" value={form.farmId} onChange={(e) => setForm((prev) => ({ ...prev, farmId: e.target.value }))} className="w-full rounded-xl bg-brand-50 border border-brand-100 px-4 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-800/35 focus:ring-2 focus:ring-brand-400 focus:border-transparent transition">
              <option value="">Select a farm</option>
              {farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <FormField label="Amount (₹)" name="amount" type="number" value={form.amount} onChange={set('amount')} placeholder="0" required icon={<IndianRupee size={15} />} />
          </div>
          <div className="sm:col-span-2">
            <FormField label="Notes" name="notes" variant="textarea" value={form.notes} onChange={set('notes')} placeholder="Optional notes" />
          </div>
          {formError && <div className="sm:col-span-2 text-sm text-red-600">{formError}</div>}
        </div>
      </Modal>
    </div>
  );
}
