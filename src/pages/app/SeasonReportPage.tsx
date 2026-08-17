import { motion } from 'framer-motion';
import { CalendarRange, IndianRupee, Download, Printer, Award, Droplets, Sprout, Wheat } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import StatTile from '@/components/ui/StatTile';
import SeasonTimeline from '@/components/dashboard/SeasonTimeline';
import { seasonSummary, seasonCrops, profitTrend } from '@/data/dummyData';

const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 };
const ratingColor: Record<string, string> = {
  A: 'bg-brand-100 text-brand-700',
  'A-': 'bg-brand-50 text-brand-600',
  'B+': 'bg-amber-50 text-amber-600',
  B: 'bg-amber-100 text-amber-700',
};

export default function SeasonReportPage() {
  const handleDownload = () => window.print();
  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarRange}
        title="Season Report"
        subtitle={`${seasonSummary.season} · ${seasonSummary.period}`}
        action={{ label: 'Download Report', icon: Download, onClick: handleDownload }}
      />

      {/* summary banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard padding="lg" className="bg-brand-700 text-white border-0 overflow-hidden relative">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-400/30 blur-3xl" />
          <div className="relative grid sm:grid-cols-3 gap-5">
            <div>
              <div className="text-brand-100 text-sm">Net Profit</div>
              <div className="font-display font-extrabold text-4xl mt-1">₹{seasonSummary.netProfit.toLocaleString('en-IN')}</div>
              <div className="mt-1 text-sm text-brand-200 flex items-center gap-1"><IndianRupee size={13} /> ▲ {seasonSummary.profitChange}% vs last season</div>
            </div>
            <div>
              <div className="text-brand-100 text-sm">Total Revenue</div>
              <div className="font-display font-extrabold text-3xl mt-1">₹{seasonSummary.totalRevenue.toLocaleString('en-IN')}</div>
              <div className="mt-1 text-sm text-brand-200">Cost: ₹{seasonSummary.totalCost.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div className="text-brand-100 text-sm">Total Yield</div>
              <div className="font-display font-extrabold text-3xl mt-1">{seasonSummary.yieldTotal.toLocaleString('en-IN')} {seasonSummary.yieldUnit}</div>
              <div className="mt-1 text-sm text-brand-200 flex items-center gap-1"><Droplets size={13} /> {seasonSummary.waterSaved}% water saved</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatTile icon={Award} label="Top Performer" value={seasonSummary.topCrop} sub="highest revenue crop" accent="bg-amber-600" />
        <StatTile icon={Sprout} label="Crops Grown" value={`${seasonCrops.length}`} sub="across the season" accent="bg-brand-600" delay={0.06} />
        <StatTile icon={Wheat} label="Total Yield" value={`${seasonSummary.yieldTotal.toLocaleString('en-IN')} ${seasonSummary.yieldUnit}`} sub="harvested" accent="bg-emerald-600" delay={0.12} />
        <StatTile icon={Droplets} label="Water Saved" value={`${seasonSummary.waterSaved}%`} sub="vs traditional irrigation" accent="bg-accent-600" delay={0.18} />
      </div>

      {/* Timeline + chart side by side */}
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3"><SeasonTimeline /></div>

        <div className="lg:col-span-2 space-y-5">
          <GlassCard padding="lg">
            <div className="font-display font-bold text-ink-900">Revenue vs Cost</div>
            <div className="text-xs text-ink-600 mt-0.5">Monthly breakdown (₹)</div>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitTrend} margin={{ top: 5, right: 10, left: -18, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ea" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} cursor={{ fill: 'rgba(34,197,94,0.06)' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                  <Bar dataKey="revenue" fill="#22c55e" radius={[6, 6, 0, 0]} name="Revenue" />
                  <Bar dataKey="cost" fill="#bae6fd" radius={[6, 6, 0, 0]} name="Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Download / Print buttons */}
          <GlassCard padding="lg">
            <div className="font-display font-bold text-ink-900 mb-3">Export Report</div>
            <div className="flex flex-col gap-3">
              <button onClick={handleDownload} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 text-white px-5 py-3 text-sm font-bold shadow-card hover:bg-brand-700 transition-colors">
                <Download size={17} /> Download PDF
              </button>
              <button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-gray-100 text-ink-800/70 px-5 py-3 text-sm font-bold hover:bg-ink-900/5 transition-colors">
                <Printer size={17} /> Print Report
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Crop-by-crop table */}
      <GlassCard padding="lg">
        <div className="font-display font-bold text-ink-900">Crop-by-Crop Performance</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-ink-600 border-b border-gray-100">
                <th className="pb-3 pr-4">Crop</th>
                <th className="pb-3 pr-4">Area</th>
                <th className="pb-3 pr-4 hidden sm:table-cell">Revenue</th>
                <th className="pb-3 pr-4 hidden sm:table-cell">Cost</th>
                <th className="pb-3 pr-4">Yield</th>
                <th className="pb-3 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/5">
              {seasonCrops.map((c) => (
                <tr key={c.crop} className="hover:bg-brand-50/40 transition-colors">
                  <td className="py-3 pr-4 font-bold text-ink-900">{c.crop}</td>
                  <td className="py-3 pr-4 text-ink-600">{c.area}</td>
                  <td className="py-3 pr-4 text-ink-900 hidden sm:table-cell">₹{c.revenue.toLocaleString('en-IN')}</td>
                  <td className="py-3 pr-4 text-ink-800/55 hidden sm:table-cell">₹{c.cost.toLocaleString('en-IN')}</td>
                  <td className="py-3 pr-4 text-ink-600">{c.yield.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-grid place-items-center h-7 w-7 rounded-lg font-bold text-xs ${ratingColor[c.rating]}`}>{c.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
