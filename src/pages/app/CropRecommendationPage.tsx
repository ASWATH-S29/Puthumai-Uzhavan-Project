import { useMemo, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, MapPin, FlaskConical, Droplets, Thermometer, CloudRain,
  Wheat, IndianRupee, TrendingUp, ShieldAlert, Sparkles, Loader2, Search,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import FormField from '@/components/ui/FormField';
import RiskMeter from '@/components/ui/RiskMeter';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { useRecommendationsContext } from '@/context/RecommendationContext';
import { recommendCrops, saveRecommendationHistory } from '@/services/cropService';
import type { CropRecommendRequest, CropRecommendation } from '@/services/types';
import { soilTypes, waterSources, seasonOptions, previousCrops } from '@/data/dummyData';

const demandColor: Record<string, string> = {
  High: 'text-brand-700 bg-brand-100',
  Medium: 'text-amber-700 bg-amber-100',
  Low: 'text-ink-600 bg-ink-900/5',
};

const waterColor: Record<string, string> = {
  Low: 'text-brand-600 bg-brand-50 border-brand-100',
  Medium: 'text-accent-600 bg-accent-50 border-accent-100',
  High: 'text-sky-600 bg-sky-50 border-sky-100',
};

const riskLevelColor: Record<string, string> = {
  Low: 'text-brand-700 bg-brand-100 border-brand-200',
  Medium: 'text-amber-700 bg-amber-100 border-amber-200',
  High: 'text-error-600 bg-error-500/10 border-error-500/20',
};

export default function CropRecommendationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addRecommendation } = useRecommendationsContext();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CropRecommendation[] | null>(null);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [soilFilter, setSoilFilter] = useState('All');
  const [waterFilter, setWaterFilter] = useState('All');
  const [detailCrop, setDetailCrop] = useState<string | null>(null);
  const [form, setForm] = useState({
    farmerName: 'Murugan R',
    village: 'Papanasam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    landSize: '3.2',
    soilType: 'Clay Loam',
    soilPH: '6.8',
    nitrogen: '280',
    phosphorus: '42',
    potassium: '185',
    temperature: '32',
    rainfall: '620',
    humidity: '72',
    waterSource: 'Canal',
    previousCrop: 'Paddy',
    season: 'Kharif',
  });

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const recommend = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setDetailCrop(null);

    try {
      const payload: CropRecommendRequest = {
        soilType: form.soilType,
        pH: Number(form.soilPH),
        rainfall: Number(form.rainfall),
        location: `${form.village}, ${form.district}, ${form.state}`,
        season: form.season,
        district: form.district,
        temperature: Number(form.temperature),
        farmArea: Number(form.landSize),
        previousCrop: form.previousCrop,
        waterAvailability: form.waterSource,
        userId: user?.id,
      };

      const response = await recommendCrops(payload);
      const ranked = response.recommendations.map((item, index) => ({ ...item, best: index === 0 }));
      setResults(ranked);

      const topCrop = ranked[0];
      if (topCrop && user?.id) {
        await saveRecommendationHistory(user.id, payload, topCrop);
        addRecommendation({
          id: `${Date.now()}`,
          user_id: user.id,
          recommended_crop: topCrop.crop,
          expected_yield: topCrop.expectedYield,
          profit_estimate: topCrop.expectedProfit,
          required_water: topCrop.waterRequirement,
          fertilizer_advice: topCrop.reason,
          created_at: new Date().toISOString(),
        });
      }
      toast('Recommendation generated successfully', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Unable to generate recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (results ?? []).filter((item) => {
      const matchesSearch = !query || item.crop.toLowerCase().includes(query) || item.reason.toLowerCase().includes(query);
      const matchesDistrict = districtFilter === 'All' || item.crop === detailCrop || true;
      const matchesSeason = seasonFilter === 'All' || form.season === seasonFilter;
      const matchesSoil = soilFilter === 'All' || form.soilType === soilFilter;
      const matchesWater = waterFilter === 'All' || item.waterRequirement === waterFilter;
      return matchesSearch && matchesDistrict && matchesSeason && matchesSoil && matchesWater;
    });
  }, [detailCrop, districtFilter, form.season, form.soilType, results, search, seasonFilter, soilFilter, waterFilter]);

  const best = filteredResults.find((r) => r.best) ?? filteredResults[0];
  const detail = filteredResults.find((item) => item.crop === detailCrop) ?? best;

  return (
    <div className="space-y-6">
      <PageHeader icon={Sprout} title="Crop Recommendation" subtitle="AI-ranked crops tailored to your soil, climate, and market demand." />

      <form onSubmit={recommend}>
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center"><FlaskConical size={17} className="text-brand-700" /></div>
            <div>
              <div className="font-display font-bold text-ink-900">Farm & Soil Parameters</div>
              <div className="text-xs text-ink-600">Fill in your details for a personalized recommendation</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField label="Farmer Name" name="farmerName" value={form.farmerName} onChange={set('farmerName')} placeholder="Your name" icon={<MapPin size={15} />} />
            <FormField label="Village" name="village" value={form.village} onChange={set('village')} placeholder="Village" />
            <FormField label="District" name="district" value={form.district} onChange={set('district')} placeholder="District" />
            <FormField label="State" name="state" value={form.state} onChange={set('state')} placeholder="State" />
            <FormField label="Land Size (acres)" name="landSize" type="number" value={form.landSize} onChange={set('landSize')} placeholder="0.0" />
            <FormField label="Soil Type" name="soilType" variant="select" value={form.soilType} onChange={set('soilType')} options={soilTypes} />
            <FormField label="Soil pH" name="soilPH" type="number" value={form.soilPH} onChange={set('soilPH')} placeholder="0.0 – 14.0" />
            <FormField label="Nitrogen (kg/ha)" name="nitrogen" type="number" value={form.nitrogen} onChange={set('nitrogen')} placeholder="0" />
            <FormField label="Phosphorus (kg/ha)" name="phosphorus" type="number" value={form.phosphorus} onChange={set('phosphorus')} placeholder="0" />
            <FormField label="Potassium (kg/ha)" name="potassium" type="number" value={form.potassium} onChange={set('potassium')} placeholder="0" />
            <FormField label="Temperature (°C)" name="temperature" type="number" value={form.temperature} onChange={set('temperature')} placeholder="0" icon={<Thermometer size={15} />} />
            <FormField label="Rainfall (mm)" name="rainfall" type="number" value={form.rainfall} onChange={set('rainfall')} placeholder="0" icon={<CloudRain size={15} />} />
            <FormField label="Humidity (%)" name="humidity" type="number" value={form.humidity} onChange={set('humidity')} placeholder="0" />
            <FormField label="Water Source" name="waterSource" variant="select" value={form.waterSource} onChange={set('waterSource')} options={waterSources} icon={<Droplets size={15} />} />
            <FormField label="Previous Crop" name="previousCrop" variant="select" value={form.previousCrop} onChange={set('previousCrop')} options={previousCrops} />
            <FormField label="Season" name="season" variant="select" value={form.season} onChange={set('season')} options={seasonOptions} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 text-white px-6 py-3 text-sm font-bold shadow-card hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            {loading ? <><Loader2 size={17} className="animate-spin" /> Analyzing…</> : <><Sparkles size={17} /> Recommend Crop</>}
          </button>
        </GlassCard>
      </form>

      <div className="grid md:grid-cols-4 gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-800/35" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search crop" className="w-full rounded-xl bg-brand-50 border border-brand-100 pl-9 pr-4 py-3 text-sm text-ink-900 outline-none" />
        </div>
        <FormField label="District" name="districtFilter" variant="select" value={districtFilter} onChange={setDistrictFilter} options={['All', 'Thanjavur', 'Coimbatore', 'Madurai', 'Tirunelveli']} placeholder="All districts" />
        <FormField label="Season" name="seasonFilter" variant="select" value={seasonFilter} onChange={setSeasonFilter} options={['All', ...seasonOptions]} placeholder="All seasons" />
        <FormField label="Water" name="waterFilter" variant="select" value={waterFilter} onChange={setWaterFilter} options={['All', 'Low', 'Medium', 'High']} placeholder="All water" />
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid sm:grid-cols-2 gap-4">
            <CardSkeleton count={2} />
          </motion.div>
        )}

        {!loading && filteredResults.length === 0 && results && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GlassCard padding="lg">
              <div className="text-sm text-ink-600">No recommendation available</div>
            </GlassCard>
          </motion.div>
        )}

        {filteredResults.length > 0 && best && !loading && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Best result hero card */}
            <div className="relative overflow-hidden rounded-2xl bg-brand-600 p-6 sm:p-8 shadow-card text-white">
              <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-brand-400/30 blur-3xl" />
              <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-accent-400/20 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  <Sparkles size={13} /> Best Match · {best.confidence}% confidence
                </div>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-white/15 grid place-items-center"><Sprout size={30} className="text-white" /></div>
                      <div>
                        <h2 className="font-display font-extrabold text-3xl">{best.crop}</h2>
                        <div className="text-brand-100 text-sm">{best.variety} · {best.growingDuration}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-brand-100 text-sm">Expected Profit</div>
                    <div className="font-display font-extrabold text-3xl">₹{best.expectedProfit.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <p className="mt-4 text-brand-100 leading-relaxed max-w-2xl">{best.reason}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className={`text-[11px] font-bold uppercase px-2.5 py-1.5 rounded-lg ${demandColor[best.marketDemand]}`}>{best.marketDemand} Demand</span>
                  <span className={`text-[11px] font-bold uppercase px-2.5 py-1.5 rounded-lg ${waterColor[best.waterRequirement]} border`}>{best.waterRequirement} Water</span>
                  <span className={`text-[11px] font-bold uppercase px-2.5 py-1.5 rounded-lg border ${riskLevelColor[best.riskLevel]}`}>{best.riskLevel} Risk</span>
                </div>
              </div>
            </div>

            {/* Detailed metrics */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Wheat, label: 'Expected Yield', value: best.expectedYield, accent: 'bg-brand-600' },
                { icon: IndianRupee, label: 'Expected Revenue', value: `₹${best.expectedRevenue.toLocaleString('en-IN')}`, accent: 'bg-accent-600' },
                { icon: TrendingUp, label: 'Expected Profit', value: `₹${best.expectedProfit.toLocaleString('en-IN')}`, accent: 'bg-emerald-600' },
                { icon: Droplets, label: 'Water Requirement', value: best.waterRequirement, accent: 'bg-sky-600' },
              ].map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <GlassCard padding="md" hover className="h-full">
                    <div className={`h-10 w-10 rounded-2xl ${m.accent} grid place-items-center shadow-card`}>
                      <m.icon size={18} className="text-white" />
                    </div>
                    <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-600">{m.label}</div>
                    <div className="font-display font-extrabold text-xl text-ink-900">{m.value}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert size={18} className="text-brand-600" />
                  <div className="font-display font-bold text-ink-900">Risk Assessment</div>
                </div>
                <RiskMeter score={best.riskLevel === 'Low' ? 22 : best.riskLevel === 'Medium' ? 52 : 78} level={best.riskLevel} label="Overall Risk" />
                <p className="mt-3 text-sm text-ink-600 leading-relaxed">
                  {best.riskLevel === 'Low'
                    ? 'Low risk based on your soil compatibility, stable market price, and favorable monsoon forecast.'
                    : best.riskLevel === 'Medium'
                    ? 'Moderate risk due to potential price fluctuation. Monitor mandi rates before harvest.'
                    : 'Higher risk — market volatility and water dependency. Consider crop insurance.'}
                </p>
              </GlassCard>
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={18} className="text-brand-600" />
                  <div className="font-display font-bold text-ink-900">Market Outlook</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><span className="text-sm text-ink-600">Market Demand</span><span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${demandColor[best.marketDemand]}`}>{best.marketDemand}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-ink-600">Mandi Price Trend</span><span className="text-sm font-bold text-brand-600">▲ +8.2%</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-ink-600">Growing Duration</span><span className="text-sm font-bold text-ink-900">{best.growingDuration}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sm text-ink-600">Water Requirement</span><span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg border ${waterColor[best.waterRequirement]}`}>{best.waterRequirement}</span></div>
                </div>
              </GlassCard>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sprout size={18} className="text-brand-600" />
                  <div className="font-display font-bold text-ink-900">Recommendation Details</div>
                </div>
                <div className="space-y-3 text-sm text-ink-600">
                  <div className="flex items-center justify-between"><span>Benefits</span><span className="font-semibold text-ink-900">{detail?.benefits?.join(', ') ?? '—'}</span></div>
                  <div className="flex items-center justify-between"><span>Disadvantages</span><span className="font-semibold text-ink-900">{detail?.disadvantages?.join(', ') ?? '—'}</span></div>
                  <div className="flex items-center justify-between"><span>Growing Steps</span><span className="font-semibold text-ink-900">{detail?.growingSteps?.join(' • ') ?? '—'}</span></div>
                  <div className="flex items-center justify-between"><span>Fertilizer</span><span className="font-semibold text-ink-900">{detail?.fertilizer ?? '—'}</span></div>
                  <div className="flex items-center justify-between"><span>Irrigation</span><span className="font-semibold text-ink-900">{detail?.irrigation ?? '—'}</span></div>
                  <div className="flex items-center justify-between"><span>Harvest Time</span><span className="font-semibold text-ink-900">{detail?.harvestTime ?? '—'}</span></div>
                  <div className="flex items-center justify-between"><span>Market Price</span><span className="font-semibold text-ink-900">{detail?.marketPrice ?? '—'}</span></div>
                </div>
              </GlassCard>
              <GlassCard padding="lg">
                <div className="font-display font-bold text-ink-900 mb-3">Top 5 Recommendations</div>
                <div className="space-y-2">
                  {filteredResults.slice(0, 5).map((crop) => (
                    <button key={crop.crop} onClick={() => setDetailCrop(crop.crop)} className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-brand-50/40 px-3 py-2 text-left">
                      <span className="text-sm font-semibold text-ink-900">{crop.crop}</span>
                      <span className="text-xs text-ink-600">{crop.confidence}% · ₹{crop.expectedProfit.toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div>
              <div className="font-display font-bold text-ink-900 mb-3">Alternative Crops</div>
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredResults.filter((r) => !r.best).map((c, i) => (
                  <motion.div key={c.crop} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <GlassCard padding="md" hover className="h-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl grid place-items-center" style={{ background: `${c.color}20` }}>
                            <Sprout size={20} style={{ color: c.color }} />
                          </div>
                          <div>
                            <div className="font-display font-bold text-ink-900">{c.crop}</div>
                            <div className="text-[11px] text-ink-600">{c.variety}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-extrabold text-xl text-brand-600">{c.confidence}%</div>
                          <div className="text-[10px] font-semibold text-ink-600 uppercase">match</div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-ink-600 leading-relaxed">{c.reason}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${demandColor[c.marketDemand]}`}>{c.marketDemand}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg border ${waterColor[c.waterRequirement]}`}>{c.waterRequirement} water</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg border ${riskLevelColor[c.riskLevel]}`}>{c.riskLevel} risk</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-ink-600">Profit /acre</span>
                        <span className="font-bold text-ink-900">₹{c.expectedProfit.toLocaleString('en-IN')}</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
