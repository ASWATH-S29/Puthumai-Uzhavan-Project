import { motion } from 'framer-motion';
import { Users, Layers, Sprout, IndianRupee, Bell, Activity, ShieldCheck, UserPlus, Camera, Wallet, Bot, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import StatTile from '@/components/ui/StatTile';
import { adminStats, adminRevenueTrend, adminCropDistribution, adminActivities, adminFarmers, type AdminActivity } from '@/data/dummyData';

const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 };

const activityIcon: Record<AdminActivity['type'], typeof Users> = {
  register: UserPlus,
  scan: Camera,
  expense: Wallet,
  chat: Bot,
  alert: AlertTriangle,
};

const activityColor: Record<AdminActivity['type'], string> = {
  register: 'bg-brand-100 text-brand-700',
  scan: 'bg-accent-100 text-accent-700',
  expense: 'bg-amber-100 text-amber-700',
  chat: 'bg-sky-100 text-sky-700',
  alert: 'bg-error-500/10 text-error-600',
};

export default function AdminPanelPage() {
  return (
    <div className="space-y-6">
      <PageHeader icon={ShieldCheck} title="Admin Panel" subtitle="Platform-wide analytics and farmer management." />

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatTile icon={Users} label="Registered Farmers" value={adminStats.registeredFarmers.toLocaleString('en-IN')} trend={{ dir: 'up', value: '12%' }} accent="bg-brand-600" />
        <StatTile icon={Layers} label="Total Farms" value={adminStats.totalFarms.toLocaleString('en-IN')} sub="across platform" accent="bg-accent-600" delay={0.06} />
        <StatTile icon={Sprout} label="Current Crops" value={adminStats.currentCrops.toLocaleString('en-IN')} sub="active cultivation" accent="bg-emerald-600" delay={0.12} />
        <StatTile icon={IndianRupee} label="Revenue" value={`₹${(adminStats.revenue / 100000).toFixed(1)}L`} trend={{ dir: 'up', value: '18%' }} accent="bg-amber-600" delay={0.18} />
        <StatTile icon={Bell} label="Active Alerts" value={`${adminStats.alerts}`} sub="require attention" accent="bg-error-600" delay={0.24} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard padding="lg" className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center"><Activity size={17} className="text-brand-700" /></div>
            <div>
              <div className="font-display font-bold text-ink-900">Platform Growth</div>
              <div className="text-xs text-ink-600">Revenue & farmer count trend</div>
            </div>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminRevenueTrend} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ea" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} fill="url(#adminRevGrad)" name="Revenue (₹)" />
                <Area type="monotone" dataKey="farmers" stroke="#0ea5e9" strokeWidth={2.5} fill="none" name="Farmers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard padding="lg">
          <div className="font-display font-bold text-ink-900">Crop Distribution</div>
          <div className="text-xs text-ink-600 mt-0.5">Across all farms</div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={adminCropDistribution} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={3} stroke="none">
                  {adminCropDistribution.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1.5">
            {adminCropDistribution.map((e) => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />
                  <span className="text-ink-800/65">{e.name}</span>
                </div>
                <span className="font-bold text-ink-900">{e.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent activity + farmers table */}
      <div className="grid lg:grid-cols-3 gap-5">
        <GlassCard padding="lg" className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-brand-600" />
            <div className="font-display font-bold text-ink-900">Recent Activity</div>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-none">
            {adminActivities.map((a, i) => {
              const IconCmp = activityIcon[a.type];
              return (
                <motion.div key={a.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-xl grid place-items-center flex-shrink-0 ${activityColor[a.type]}`}>
                    <IconCmp size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink-900">{a.farmer}</div>
                    <div className="text-xs text-ink-800/55 leading-snug">{a.action}</div>
                    <div className="text-[10px] text-ink-600/60 mt-0.5">{a.time}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard padding="lg" className="lg:col-span-2">
          <div className="font-display font-bold text-ink-900">Registered Farmers</div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-ink-600 border-b border-gray-100">
                  <th className="pb-3 pr-4">Farmer</th>
                  <th className="pb-3 pr-4 hidden sm:table-cell">Location</th>
                  <th className="pb-3 pr-4">Farms</th>
                  <th className="pb-3 pr-4 hidden sm:table-cell">Acres</th>
                  <th className="pb-3 pr-4">Plan</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                {adminFarmers.map((f) => (
                  <tr key={f.id} className="hover:bg-brand-50/40 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-brand-600 grid place-items-center text-white text-[11px] font-bold flex-shrink-0">{f.name.split(' ').map((n) => n[0]).join('')}</div>
                        <span className="font-semibold text-ink-900">{f.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-ink-800/55 hidden sm:table-cell">{f.location}</td>
                    <td className="py-3 pr-4 font-bold text-ink-900">{f.farms}</td>
                    <td className="py-3 pr-4 text-ink-600 hidden sm:table-cell">{f.acres}</td>
                    <td className="py-3 pr-4"><span className={`rounded-lg px-2 py-1 text-[11px] font-bold ${f.plan === 'Pro' ? 'bg-brand-100 text-brand-700' : 'bg-ink-900/5 text-ink-800/55'}`}>{f.plan}</span></td>
                    <td className="py-3 text-right"><span className={`rounded-lg px-2 py-1 text-[11px] font-bold ${f.status === 'Active' ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700'}`}>{f.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
