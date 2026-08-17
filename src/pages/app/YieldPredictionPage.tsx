import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Gauge, IndianRupee, Wheat, Loader2, Sparkles, BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import FormField from '@/components/ui/FormField';
import RiskMeter from '@/components/ui/RiskMeter';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { yieldTrend, yieldFields, yieldByGrowthStage, yieldPrediction, previousCrops } from '@/data/dummyData';

const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 };

export default function YieldPredictionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof yieldPrediction | null>(null);
  const [form, setForm] = useState({
    crop: 'Paddy', area: '3.2', expenses: '98000', rainfall: '620',
    weather: 'Favorable', growth: 'Tillering',
  });
  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const predict = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setTimeout(() => { setResult(yieldPrediction); setLoading(false); }, 1400);
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={TrendingUp} title="Yield Prediction" subtitle="Forecast harvest volumes using growth-stage analytics and history." />

      {/* Input form */}
      <form onSubmit={predict}>
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center"><Gauge size={17} className="text-brand-700" /></div>
            <div>
              <div className="font-display font-bold text-ink-900">Prediction Parameters</div>
              <div className="text-xs text-ink-600">Enter your field details for an AI-powered forecast</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label="Crop" name="crop" variant="select" value={form.crop} onChange={set('crop')} options={previousCrops.filter((c) => c !== 'None')} />
            <FormField label="Land Area (acres)" name="area" type="number" value={form.area} onChange={set('area')} placeholder="0.0" />
            <FormField label="Current Growth Stage" name="growth" variant="select" value={form.growth} onChange={set('growth')} options={['Germination', 'Tillering', 'Panicle', 'Grain Fill', 'Flowering', 'Maturity']} />
            <FormField label="Expenses so far (₹)" name="expenses" type="number" value={form.expenses} onChange={set('expenses')} placeholder="0" icon={<IndianRupee size={15} />} />
            <FormField label="Rainfall (mm)" name="rainfall" type="number" value={form.rainfall} onChange={set('rainfall')} placeholder="0" />
            <FormField label="Expected Weather" name="weather" variant="select" value={form.weather} onChange={set('weather')} options={['Favorable', 'Normal', 'Unfavorable']} />
          </div>
          <button type="submit" disabled={loading} className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 text-white px-6 py-3 text-sm font-bold shadow-card hover:bg-brand-700 transition-colors disabled:opacity-60">
            {loading ? <><Loader2 size={17} className="animate-spin" /> Predicting…</> : <><Sparkles size={17} /> Predict Yield</>}
          </button>
        </GlassCard>
      </form>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"><CardSkeleton count={4} /></div>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Output stat cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Wheat, label: 'Predicted Yield', value: `${result.predictedYield.toLocaleString('en-IN')} ${result.yieldUnit}`, accent: 'bg-brand-600' },
                { icon: IndianRupee, label: 'Expected Revenue', value: `₹${result.expectedRevenue.toLocaleString('en-IN')}`, accent: 'bg-accent-600' },
                { icon: TrendingUp, label: 'Net Profit', value: `₹${result.netProfit.toLocaleString('en-IN')}`, accent: 'bg-emerald-600' },
                { icon: BarChart3, label: 'ROI', value: `${result.roi}%`, accent: 'bg-amber-600' },
              ].map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <GlassCard padding="md" hover className="h-full">
                    <div className={`h-11 w-11 rounded-2xl ${m.accent} grid place-items-center shadow-card`}>
                      <m.icon size={20} className="text-white" />
                    </div>
                    <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-600">{m.label}</div>
                    <div className="font-display font-extrabold text-2xl text-ink-900">{m.value}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Risk meter + expenses */}
            <div className="grid lg:grid-cols-3 gap-5">
              <GlassCard padding="lg" className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <Gauge size={18} className="text-brand-600" />
                  <div className="font-display font-bold text-ink-900">Risk Assessment</div>
                </div>
                <RiskMeter score={result.riskScore} level={result.riskLevel} />
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-ink-600">Total Expenses</span><span className="font-bold text-ink-900">₹{result.totalExpenses.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-ink-600">Expected Revenue</span><span className="font-bold text-brand-600">₹{result.expectedRevenue.toLocaleString('en-IN')}</span></div>
                </div>
              </GlassCard>

              <GlassCard padding="lg" className="lg:col-span-2">
                <div className="font-display font-bold text-ink-900">Yield by Growth Stage</div>
                <div className="text-xs text-ink-600 mt-0.5">Projected yield progression (kg)</div>
                <div className="mt-5 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yieldByGrowthStage} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ea" vertical={false} />
                      <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v} kg`} cursor={{ fill: 'rgba(34,197,94,0.06)' }} />
                      <Bar dataKey="projected" radius={[8, 8, 0, 0]} name="Projected Yield">
                        {yieldByGrowthStage.map((_, i) => <Cell key={i} fill="#16a34a" />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Farm yield trend */}
      <GlassCard padding="lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center"><TrendingUp size={17} className="text-brand-700" /></div>
            <div>
              <div className="font-display font-bold text-ink-900">Farm Yield Trend</div>
              <div className="text-xs text-ink-600">Actual vs AI predicted (kg)</div>
            </div>
          </div>
          <span className="text-xs font-bold text-brand-600 bg-brand-50 rounded-lg px-2.5 py-1">+12% forecast</span>
        </div>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={yieldTrend} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ea" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
              <Area type="monotone" dataKey="predicted" stroke="#0ea5e9" strokeWidth={2.5} strokeDasharray="5 4" fill="url(#predGrad2)" name="AI Predicted" connectNulls />
              <Area type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={2.5} fill="url(#actualGrad2)" name="Actual" connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Per-field breakdown */}
      <div className="grid sm:grid-cols-2 gap-4">
        {yieldFields.map((f, i) => {
          const change = ((f.predicted - f.lastSeason) / f.lastSeason) * 100;
          return (
            <motion.div key={f.field} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard padding="md" hover className="h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-ink-900">{f.field} · {f.crop}</div>
                    <div className="text-xs text-ink-600">{f.area}</div>
                  </div>
                  <div className={`text-xs font-bold ${change >= 0 ? 'text-brand-600' : 'text-error-600'}`}>{change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%</div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-brand-50 border border-brand-100 p-3">
                    <div className="text-[10px] font-bold uppercase text-ink-600">Predicted</div>
                    <div className="font-display font-extrabold text-2xl text-ink-900">{f.predicted}</div>
                    <div className="text-[11px] text-ink-600">{f.unit}</div>
                  </div>
                  <div className="rounded-2xl bg-brand-50 border border-gray-100 p-3">
                    <div className="text-[10px] font-bold uppercase text-ink-600">Last Season</div>
                    <div className="font-display font-extrabold text-2xl text-ink-600">{f.lastSeason}</div>
                    <div className="text-[11px] text-ink-600">{f.unit}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-ink-600">Model confidence</span>
                  <span className="font-bold text-brand-600">{f.confidence}%</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-ink-900/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${f.confidence}%` }} transition={{ duration: 0.8, delay: i * 0.08 }} className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
