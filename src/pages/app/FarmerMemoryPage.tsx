/**
 * FarmerMemoryPage.tsx  v2.0
 * Feature 1 + 7: Farmer Memory & Farm Profile Completeness
 */

import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Save, Loader2, CheckCircle2, AlertCircle,
  MapPinned, Sprout, Droplets, History, Settings2,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import {
  getFarmerMemory, saveFarmerMemory, computeProfileCompleteness,
  type FarmerMemory,
} from '@/services/farmerMemoryService';

const SOIL_TYPES = ['Red Soil', 'Black Soil', 'Alluvial Soil', 'Laterite Soil', 'Sandy Soil', 'Clay Soil'];
const IRRIGATION = ['Drip', 'Sprinkler', 'Flood', 'Rain-fed', 'Canal', 'Bore Well', 'Tank'];
const CROP_STAGES = ['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Fruit Set', 'Harvesting', 'Post-Harvest'];
const FARM_CATEGORIES = ['Marginal (< 1 acre)', 'Small (1–2 acres)', 'Medium (2–10 acres)', 'Large (> 10 acres)'];
const LANGUAGES = [
  { value: 'ta', label: 'Tamil (தமிழ்)' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi (हिंदी)' },
  { value: 'te', label: 'Telugu (తెలుగు)' },
  { value: 'ml', label: 'Malayalam (മലയാളം)' },
  { value: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
];

const inputClass = 'w-full rounded-xl bg-brand-50 border border-gray-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400 transition';
const labelClass = 'block text-[11px] font-bold uppercase tracking-wider text-ink-800/50 mb-1';

interface FieldProps {
  label: string;
  children: React.ReactNode;
}
function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

const emptyForm: Omit<FarmerMemory, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  farmer_name: '', village: '', district: '', state: 'Tamil Nadu',
  farm_size_acres: null, farming_category: '', soil_type: '', irrigation_method: '',
  current_crop: '', crop_variety: '', crop_stage: '', planting_date: '',
  expected_harvest: '', previous_crop: '', previous_yield_kg: null,
  preferred_language: 'en', extra_notes: '',
};

export default function FarmerMemoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const completeness = computeProfileCompleteness(form as FarmerMemory);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    getFarmerMemory(user.id)
      .then((mem) => {
        if (mem) {
          setForm({
            farmer_name: mem.farmer_name ?? '', village: mem.village ?? '',
            district: mem.district ?? '', state: mem.state ?? 'Tamil Nadu',
            farm_size_acres: mem.farm_size_acres ?? null,
            farming_category: mem.farming_category ?? '', soil_type: mem.soil_type ?? '',
            irrigation_method: mem.irrigation_method ?? '', current_crop: mem.current_crop ?? '',
            crop_variety: mem.crop_variety ?? '', crop_stage: mem.crop_stage ?? '',
            planting_date: mem.planting_date ?? '', expected_harvest: mem.expected_harvest ?? '',
            previous_crop: mem.previous_crop ?? '',
            previous_yield_kg: mem.previous_yield_kg ?? null,
            preferred_language: mem.preferred_language ?? 'en', extra_notes: mem.extra_notes ?? '',
          });
        }
      })
      .catch((err) => setFetchError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const set = (key: keyof typeof form, value: string | number | null) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true); setSaved(false);
    try {
      await saveFarmerMemory(user.id, form);
      setSaved(true);
      toast('Farm memory saved! AI will now use your farm profile.', 'success');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-700">
      Please log in to manage your farm memory.
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-brand-600" size={32} />
    </div>
  );

  const barColor = completeness.score >= 80 ? 'bg-brand-500' : completeness.score >= 50 ? 'bg-amber-500' : 'bg-red-400';

  return (
    <div className="space-y-6">
      <PageHeader icon={Brain} title="Farmer Memory"
        subtitle="Your farm profile — the AI uses this to give personalised, field-specific advice." />

      {fetchError && (
        <div className="flex gap-2 items-center rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} /> {fetchError} — your changes will still save.
        </div>
      )}

      {/* Profile completeness */}
      <GlassCard padding="lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-ink-900">Farm Profile Completeness</span>
          <span className="text-sm font-bold text-brand-700">{completeness.score}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <motion.div className={`h-3 rounded-full ${barColor}`}
            initial={{ width: 0 }} animate={{ width: `${completeness.score}%` }}
            transition={{ duration: 0.6 }} />
        </div>
        {completeness.missing.length > 0 && (
          <div className="mt-3 text-xs text-ink-600">
            <span className="font-semibold">Missing:</span> {completeness.missing.join(', ')}
            <p className="mt-1 text-ink-500">Complete your profile to get more accurate AI advice and scheme recommendations.</p>
          </div>
        )}
        {completeness.score === 100 && (
          <div className="mt-2 flex items-center gap-2 text-brand-700 text-xs font-semibold">
            <CheckCircle2 size={14} /> Profile complete — AI has full farm context!
          </div>
        )}
      </GlassCard>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Identity & Location */}
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <MapPinned size={18} className="text-brand-600" />
            <span className="font-display font-bold text-ink-900">Identity & Location</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Farmer Name">
              <input className={inputClass} value={form.farmer_name ?? ''} onChange={(e) => set('farmer_name', e.target.value)} placeholder="Your name" />
            </Field>
            <Field label="Village">
              <input className={inputClass} value={form.village ?? ''} onChange={(e) => set('village', e.target.value)} placeholder="e.g. Poolankinar" />
            </Field>
            <Field label="District">
              <input className={inputClass} value={form.district ?? ''} onChange={(e) => set('district', e.target.value)} placeholder="e.g. Thanjavur" />
            </Field>
            <Field label="State">
              <input className={inputClass} value={form.state ?? ''} onChange={(e) => set('state', e.target.value)} placeholder="Tamil Nadu" />
            </Field>
          </div>
        </GlassCard>

        {/* Farm Details */}
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 size={18} className="text-brand-600" />
            <span className="font-display font-bold text-ink-900">Farm Details</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Farm Size (acres)">
              <input type="number" min="0" step="0.1" className={inputClass}
                value={form.farm_size_acres ?? ''}
                onChange={(e) => set('farm_size_acres', e.target.value ? Number(e.target.value) : null)}
                placeholder="e.g. 3.5" />
            </Field>
            <Field label="Farm Category">
              <select className={inputClass} value={form.farming_category ?? ''} onChange={(e) => set('farming_category', e.target.value)}>
                <option value="">Select…</option>
                {FARM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Soil Type">
              <select className={inputClass} value={form.soil_type ?? ''} onChange={(e) => set('soil_type', e.target.value)}>
                <option value="">Select…</option>
                {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Irrigation Method">
              <select className={inputClass} value={form.irrigation_method ?? ''} onChange={(e) => set('irrigation_method', e.target.value)}>
                <option value="">Select…</option>
                {IRRIGATION.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
          </div>
        </GlassCard>

        {/* Current Crop */}
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Sprout size={18} className="text-brand-600" />
            <span className="font-display font-bold text-ink-900">Current Crop</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Crop Name">
              <input className={inputClass} value={form.current_crop ?? ''} onChange={(e) => set('current_crop', e.target.value)} placeholder="e.g. Paddy, Sugarcane, Tomato" />
            </Field>
            <Field label="Variety">
              <input className={inputClass} value={form.crop_variety ?? ''} onChange={(e) => set('crop_variety', e.target.value)} placeholder="e.g. ADT-43, CO-86032" />
            </Field>
            <Field label="Crop Stage">
              <select className={inputClass} value={form.crop_stage ?? ''} onChange={(e) => set('crop_stage', e.target.value)}>
                <option value="">Select…</option>
                {CROP_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Planting Date">
              <input type="date" className={inputClass} value={form.planting_date ?? ''} onChange={(e) => set('planting_date', e.target.value)} />
            </Field>
            <Field label="Expected Harvest Date">
              <input type="date" className={inputClass} value={form.expected_harvest ?? ''} onChange={(e) => set('expected_harvest', e.target.value)} />
            </Field>
          </div>
        </GlassCard>

        {/* Previous Season */}
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <History size={18} className="text-brand-600" />
            <span className="font-display font-bold text-ink-900">Previous Season</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Previous Crop">
              <input className={inputClass} value={form.previous_crop ?? ''} onChange={(e) => set('previous_crop', e.target.value)} placeholder="e.g. Black Gram" />
            </Field>
            <Field label="Previous Yield (kg)">
              <input type="number" min="0" className={inputClass}
                value={form.previous_yield_kg ?? ''}
                onChange={(e) => set('previous_yield_kg', e.target.value ? Number(e.target.value) : null)}
                placeholder="e.g. 4500" />
            </Field>
          </div>
        </GlassCard>

        {/* Preferences & Notes */}
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Droplets size={18} className="text-brand-600" />
            <span className="font-display font-bold text-ink-900">Preferences & Notes</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Preferred Language (for AI responses)">
              <select className={inputClass} value={form.preferred_language ?? 'en'} onChange={(e) => set('preferred_language', e.target.value)}>
                {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Extra Farm Notes (problems, goals, equipment…)">
                <textarea rows={3}
                  className={`${inputClass} resize-none`}
                  value={form.extra_notes ?? ''}
                  onChange={(e) => set('extra_notes', e.target.value)}
                  placeholder="e.g. Facing leaf curl in tomato, want to switch to organic inputs next season…" />
              </Field>
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors shadow-card disabled:opacity-60">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
              : saved  ? <><CheckCircle2 size={16} /> Saved!</>
              : <><Save size={16} /> Save Farm Memory</>}
          </button>
        </div>
      </form>
    </div>
  );
}
