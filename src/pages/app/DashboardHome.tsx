import WelcomeCard           from '@/components/dashboard/WelcomeCard';
import KpiStrip              from '@/components/dashboard/KpiStrip';
import WeatherCard           from '@/components/dashboard/WeatherCard';
import CropRecommendationCard from '@/components/dashboard/CropRecommendationCard';
import FarmOverview          from '@/components/dashboard/FarmOverview';
import ExpenseStatCard       from '@/components/dashboard/ExpenseStatCard';
import CropHealthScore       from '@/components/dashboard/CropHealthScore';
import ChartsSection         from '@/components/dashboard/ChartsSection';
import AIAssistantQuickPanel from '@/components/dashboard/AIAssistantQuickPanel';
import GovSchemesCard        from '@/components/dashboard/GovSchemesCard';
import RecentActivities      from '@/components/dashboard/RecentActivities';
import MarketplacePreview    from '@/components/dashboard/MarketplacePreview';

export default function DashboardHome() {
  return (
    <div className="space-y-5">

      {/* ── Row 1: Welcome banner ── */}
      <WelcomeCard />

      {/* ── Row 2: KPI Cards ── */}
      <KpiStrip />

      {/* ── Row 3: Weather | Crop Recommendation | Crop Health ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        <WeatherCard />
        <CropRecommendationCard />
        <CropHealthScore />
      </div>

      {/* ── Row 4: Farm Overview | Expense Summary | AI Quick Panel ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <FarmOverview />
        </div>
        <div className="lg:col-span-1">
          <ExpenseStatCard />
        </div>
        <div className="lg:col-span-1">
          <AIAssistantQuickPanel />
        </div>
      </div>

      {/* ── Row 5: Charts (Income vs Expense + Expense Summary) ── */}
      <ChartsSection />

      {/* ── Row 6: Gov Schemes ── */}
      <GovSchemesCard />

      {/* ── Row 7: Marketplace Preview ── */}
      <MarketplacePreview />

      {/* ── Row 8: Recent Activity ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <RecentActivities />
        </div>
        {/* Quick stats summary */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500 mb-4">
            This Season — Kharif 2026
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue',  value: '₹4,50,000', sub: 'Kharif 2026',    color: 'text-green-700',  bg: 'bg-green-50'  },
              { label: 'Total Cost',     value: '₹2,48,000', sub: 'All inputs',     color: 'text-amber-700',  bg: 'bg-amber-50'  },
              { label: 'Net Profit',     value: '₹2,02,000', sub: '+28% vs last',   color: 'text-brand-700',  bg: 'bg-brand-50'  },
              { label: 'Yield Total',    value: '10,250 kg',  sub: 'All crops',      color: 'text-sky-700',    bg: 'bg-sky-50'    },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl ${s.bg} p-4`}>
                <div className="text-[10px] font-semibold text-ink-500 uppercase">{s.label}</div>
                <div className={`font-display font-bold text-xl mt-1 ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-ink-500 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Top crop */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500 mb-3">
              Top Performing Crop
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-brand-50 border border-brand-100">
              <div className="text-3xl">🌾</div>
              <div>
                <div className="font-semibold text-ink-900">Paddy · CR-1009</div>
                <div className="text-xs text-ink-600 mt-0.5">3.2 acres · 2,640 kg/acre · ₹1,86,000 revenue</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs font-bold text-brand-700 bg-brand-100 px-2 py-1 rounded-md">Grade A</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
