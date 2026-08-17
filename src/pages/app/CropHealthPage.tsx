import { useEffect, useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Camera, ShieldCheck, AlertTriangle, Upload, Loader2, Bug, Droplets, FlaskConical, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import FormField from '@/components/ui/FormField';
import StatTile from '@/components/ui/StatTile';
import { useToast } from '@/components/ui/Toast';
import { useScanner } from '@/hooks/useScanner';
import { useAuth } from '@/context/AuthContext';
import { getCropScanHistory, saveCropScanHistory } from '@/services/scannerService';
import type { CropScanHistoryRow, ScannerResponse } from '@/services/types';
import { scanResults, cropHealthTimeline } from '@/data/dummyData';

const sevColor: Record<string, string> = {
  None: 'text-brand-600 bg-brand-50 border-brand-100',
  Low: 'text-amber-600 bg-amber-50 border-amber-100',
  Moderate: 'text-orange-600 bg-orange-50 border-orange-100',
  High: 'text-error-600 bg-error-500/10 border-error-500/20',
};
const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 };

export default function CropHealthPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const scanner = useScanner();

  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState('Paddy');
  const [field, setField] = useState('Field 1');
  const [currentScan, setCurrentScan] = useState<ScannerResponse | null>(null);
  const [recentScans, setRecentScans] = useState<CropScanHistoryRow[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const scansToShow = recentScans.length > 0 ? recentScans : scanResults;
  const healthy = scansToShow.filter((s) => s.status === 'Healthy').length;
  const action = scansToShow.length - healthy;
  const scanCount = scansToShow.length;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setCurrentScan(null);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onBrowse = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const loadHistory = async () => {
    if (!user?.id) {
      setRecentScans([]);
      return;
    }

    try {
      const rows = await getCropScanHistory(user.id);
      setRecentScans(rows);
    } catch {
      setRecentScans([]);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, [user?.id]);

  const analyze = async () => {
    if (!preview) return;
    if (!crop.trim() || !field.trim()) {
      toast('Please provide both crop and field name.', 'error');
      return;
    }

    try {
      const response = await scanner.mutate({ crop, field, imageData: preview });
      setCurrentScan(response);

      if (user?.id) {
        try {
          await saveCropScanHistory(user.id, response.result);
          void loadHistory();
          toast('Scan saved to your history.', 'success');
        } catch (historyError) {
          toast(historyError instanceof Error ? historyError.message : 'Could not save scan history', 'info');
        }
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Analysis failed. Please try again.', 'error');
    }
  };

  const analysis = currentScan?.analysis;
  const analysisCards = analysis
    ? [
        { icon: AlertTriangle, label: 'Disease', value: analysis.disease ?? 'None detected', confidence: analysis.diseaseConfidence, accent: analysis.disease ? 'bg-amber-600' : 'bg-brand-600', status: analysis.disease ? 'Action needed' : 'Healthy' },
        { icon: FlaskConical, label: 'Nutrient Deficiency', value: analysis.nutrientDeficiency, confidence: analysis.nutrientConfidence, accent: 'bg-accent-600', status: analysis.nutrientDeficiency.includes('None') ? 'OK' : 'Supplement' },
        { icon: Droplets, label: 'Water Stress', value: analysis.waterStress, confidence: analysis.waterConfidence, accent: 'bg-sky-600', status: analysis.waterStress },
        { icon: Bug, label: 'Pest Risk', value: analysis.pestRisk, confidence: analysis.pestConfidence, accent: 'bg-orange-600', status: analysis.pestRisk },
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader icon={Leaf} title="Crop Health Scanner" subtitle="Photo-based pest & disease detection with instant treatment plans." />

      <div className="grid sm:grid-cols-3 gap-4">
        <StatTile icon={ShieldCheck} label="Healthy Fields" value={`${healthy}`} sub="no issues detected" accent="from-brand-500 to-brand-700" />
        <StatTile icon={AlertTriangle} label="Action Needed" value={`${action}`} sub="treatment recommended" accent="from-amber-500 to-amber-600" delay={0.06} />
        <StatTile icon={Camera} label="Scans This Week" value={`${scanCount}`} sub="across all fields" accent="from-accent-500 to-accent-700" delay={0.12} />
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Upload area */}
        <GlassCard padding="lg" className="lg:col-span-2">
          <div className="font-display font-bold text-ink-900">Upload a Leaf Photo</div>
          <div className="text-xs text-ink-600 mt-0.5">AI detects 40+ common diseases in seconds.</div>

          <div className="grid gap-3 sm:grid-cols-2 mt-4">
            <FormField label="Crop" name="crop" value={crop} onChange={setCrop} placeholder="Paddy" />
            <FormField label="Field name" name="field" value={field} onChange={setField} placeholder="Field 1" />
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`mt-5 rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${dragging ? 'border-brand-500 bg-brand-50 scale-[1.01]' : 'border-brand-200 bg-brand-50'}`}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onBrowse} />
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-xl shadow-card" />
                  <div className="mt-3 text-sm font-semibold text-ink-900">Click to change image</div>
                </motion.div>
              ) : (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-brand-600 grid place-items-center shadow-card">
                    <Upload size={26} className="text-white" />
                  </div>
                  <div className="mt-3 font-semibold text-ink-900">Drag & drop or browse</div>
                  <div className="text-xs text-ink-600 mt-1">JPG / PNG · up to 10 MB</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {preview && (
            <button
              onClick={analyze}
              disabled={scanner.loading}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 text-white px-5 py-3 text-sm font-bold shadow-card hover:bg-brand-700 transition-colors disabled:opacity-60"
            >
              {scanner.loading ? <><Loader2 size={17} className="animate-spin" /> Analyzing image…</> : <><Activity size={17} /> Analyze Crop Health</>}
            </button>
          )}

          {!user?.id && (
            <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-100 p-3 text-sm text-amber-700">
              Sign in to save scans and view your scan history.
            </div>
          )}
        </GlassCard>

        {/* Analysis results */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            {scanner.loading && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard padding="lg" className="grid place-items-center py-12">
                  <Loader2 size={32} className="animate-spin text-brand-600" />
                  <div className="mt-3 text-sm font-semibold text-ink-600">Running AI analysis…</div>
                </GlassCard>
              </motion.div>
            )}

            {currentScan && !scanner.loading && currentScan.analysis && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <GlassCard padding="lg" className="bg-brand-600 text-white border-0 relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand-400/30 blur-3xl" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <div className="text-brand-100 text-sm">Overall Confidence</div>
                      <div className="font-display font-extrabold text-4xl">{currentScan.analysis.overallConfidence}%</div>
                    </div>
                    <div className="h-14 w-14 rounded-xl bg-white/15 grid place-items-center"><Activity size={28} className="text-white" /></div>
                  </div>
                </GlassCard>

                <div className="grid sm:grid-cols-2 gap-4">
                  {analysisCards.map((c, i) => (
                    <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <GlassCard padding="md" hover className="h-full">
                        <div className="flex items-center justify-between">
                          <div className={`h-10 w-10 rounded-2xl ${c.accent} grid place-items-center shadow-card`}>
                            <c.icon size={18} className="text-white" />
                          </div>
                          <span className="text-[11px] font-bold uppercase px-2 py-1 rounded-lg bg-ink-900/5 text-ink-600">{c.status}</span>
                        </div>
                        <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-600">{c.label}</div>
                        <div className="text-sm font-bold text-ink-900 mt-0.5">{c.value}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-ink-900/5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${c.confidence}%` }} transition={{ duration: 0.8, delay: i * 0.08 }} className="h-full rounded-full bg-brand-500" />
                          </div>
                          <span className="text-[11px] font-bold text-brand-600">{c.confidence}%</span>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>

                <GlassCard padding="lg" className="bg-brand-50 border-brand-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-brand-600" />
                    <div className="font-display font-bold text-ink-900">Recommended Action</div>
                  </div>
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed">{currentScan.analysis.recommendation}</p>
                </GlassCard>
              </motion.div>
            )}

            {!currentScan?.analysis && !scanner.loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassCard padding="lg" className="h-full grid place-items-center py-16">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-xl bg-brand-100 grid place-items-center mb-3"><Camera size={28} className="text-brand-600" /></div>
                    <div className="font-display font-bold text-ink-900">Ready to scan</div>
                    <div className="text-sm text-ink-600 mt-1">Upload a photo to see the AI analysis</div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <GlassCard padding="lg" className="lg:col-span-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center"><Leaf size={17} className="text-brand-700" /></div>
            <div>
              <div className="font-display font-bold text-ink-900">Health Trend · Last 4 Weeks</div>
              <div className="text-xs text-ink-600">Score per field</div>
            </div>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cropHealthTimeline} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ea" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Line type="monotone" dataKey="paddy" stroke="#22c55e" strokeWidth={2.5} dot={false} name="Paddy" />
                <Line type="monotone" dataKey="tomato" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Tomato" />
                <Line type="monotone" dataKey="sugarcane" stroke="#0ea5e9" strokeWidth={2.5} dot={false} name="Sugarcane" />
                <Line type="monotone" dataKey="banana" stroke="#f59e0b" strokeWidth={2.5} dot={false} name="Banana" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard padding="lg" className="lg:col-span-2">
          <div className="font-display font-bold text-ink-900">Recent Scans</div>
          <div className="mt-4 space-y-3">
            {scansToShow.slice(0, 4).map((s, i) => (
              <motion.div key={`${s.crop}-${s.field}-${s.date}-${i}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 rounded-2xl bg-brand-50 border border-gray-100 p-3">
                <div className={`h-9 w-9 rounded-xl grid place-items-center flex-shrink-0 ${s.disease ? 'bg-amber-50' : 'bg-brand-50'}`}>
                  {s.disease ? <AlertTriangle size={16} className="text-amber-600" /> : <ShieldCheck size={16} className="text-brand-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-ink-900 truncate">{s.crop} · {s.field}</div>
                  <div className="text-[11px] text-ink-600">{s.date} · {s.disease ?? 'Healthy'}</div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg border ${sevColor[s.severity]}`}>{s.severity}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
