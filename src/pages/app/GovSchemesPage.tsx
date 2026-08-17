/**
 * GovSchemesPage.tsx  v2.0
 * Feature 5: AI Government Scheme Finder
 * Uses farmer memory to recommend relevant schemes via Gemini.
 */

import { useState, useEffect } from 'react';
import {
  Landmark, Search, Loader2, ExternalLink, ChevronDown, ChevronUp,
  FileText, CheckCircle2, AlertCircle, Brain, Sparkles,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/context/AuthContext';
import { getFarmerMemory, buildFarmerMemoryContext } from '@/services/farmerMemoryService';
import { askGemini } from '@/services/geminiService';

interface Scheme {
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  documents: string;
  howToApply: string;
  link: string;
  state: string;
  category: string;
}

// Static well-known schemes as a fallback / base
const STATIC_SCHEMES: Scheme[] = [
  {
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Direct income support of ₹6,000/year (in 3 instalments of ₹2,000) to landholding farmer families across India.',
    eligibility: 'All landholding farmers with valid land records. Excludes institutional landholders, salaried individuals, income-tax payers, and professionals.',
    benefits: '₹6,000 per year transferred directly to bank account.',
    documents: 'Aadhaar card, bank account details, land records (Patta/Chitta in Tamil Nadu).',
    howToApply: 'Apply at pmkisan.gov.in or through local Patwari / Village Revenue Officer.',
    link: 'https://pmkisan.gov.in',
    state: 'All India',
    category: 'Income Support',
  },
  {
    name: 'PMFBY – Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities, pests, and diseases.',
    eligibility: 'All farmers growing notified crops in notified areas. Loanee farmers are enrolled compulsorily.',
    benefits: 'Insurance coverage up to full sum insured at low premium (2% for Kharif, 1.5% for Rabi, 5% for commercial crops).',
    documents: 'Aadhaar, bank account, land records, sowing certificate.',
    howToApply: 'Apply through nearest bank, Common Service Centre (CSC), or at pmfby.gov.in.',
    link: 'https://pmfby.gov.in',
    state: 'All India',
    category: 'Crop Insurance',
  },
  {
    name: 'Soil Health Card Scheme',
    description: 'Provides every farmer a Soil Health Card with crop-wise recommendations of nutrients and fertilisers for individual farms.',
    eligibility: 'All farmers in India.',
    benefits: 'Free soil testing, personalised fertiliser recommendation card valid for 3 years.',
    documents: 'Aadhaar card, land details.',
    howToApply: 'Contact local agriculture department or Krishi Vigyan Kendra (KVK). Apply at soilhealth.dac.gov.in.',
    link: 'https://soilhealth.dac.gov.in',
    state: 'All India',
    category: 'Soil Health',
  },
  {
    name: 'TNAU Crop Advisory – Tamil Nadu',
    description: 'Tamil Nadu Agricultural University (TNAU) provides free crop advisory, seed supply, and technology transfer to Tamil Nadu farmers.',
    eligibility: 'Farmers in Tamil Nadu.',
    benefits: 'Free agro-advisory, improved seed varieties, pest management guidance.',
    documents: 'Contact nearest TNAU centre or Agri extension office.',
    howToApply: 'Visit agritech.tnau.ac.in or contact District Agriculture Office.',
    link: 'https://agritech.tnau.ac.in',
    state: 'Tamil Nadu',
    category: 'Technical Support',
  },
  {
    name: 'eNAM – National Agriculture Market',
    description: 'Online trading platform for agricultural commodities connecting farmers, traders, and buyers across APMCs nationwide.',
    eligibility: 'All farmers and agri-traders.',
    benefits: 'Better market access, transparent price discovery, reduced post-harvest losses.',
    documents: 'Aadhaar, bank account for payment, commodity certificate.',
    howToApply: 'Register at enam.gov.in or contact nearest APMC/Mandi.',
    link: 'https://enam.gov.in',
    state: 'All India',
    category: 'Market Access',
  },
  {
    name: 'PM Kisan Maan Dhan Yojana – Farmers Pension',
    description: 'Voluntary pension scheme for small and marginal farmers providing ₹3,000/month after age 60.',
    eligibility: 'Small and marginal farmers aged 18–40 years with less than 2 hectares of cultivable land.',
    benefits: '₹3,000/month pension after 60 years of age.',
    documents: 'Aadhaar, bank account, land records.',
    howToApply: 'Enrol at nearest Common Service Centre (CSC) or maandhan.in.',
    link: 'https://maandhan.in',
    state: 'All India',
    category: 'Pension',
  },
];

interface ExpandedState {
  [key: string]: boolean;
}

export default function GovSchemesPage() {
  const { user } = useAuth();
  const [schemes] = useState<Scheme[]>(STATIC_SCHEMES);
  const [aiSchemes, setAiSchemes] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [hasMemory, setHasMemory] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    getFarmerMemory(user.id).then((mem) => {
      if (mem && (mem.current_crop || mem.district || mem.state)) {
        setHasMemory(true);
      }
    }).catch(() => {});
  }, [user?.id]);

  const fetchAIRecommendations = async () => {
    if (!user?.id) return;
    setLoadingAI(true);
    setAiError(null);
    setAiSchemes('');
    try {
      const mem = await getFarmerMemory(user.id);
      const ctx = buildFarmerMemoryContext(mem);

      const prompt = `${ctx}

Based on the farmer profile above, recommend the most relevant Central and Tamil Nadu State government agricultural schemes.

For each scheme provide:
- Scheme Name
- Why it is relevant for this farmer specifically
- Key benefit
- Official website or how to apply

Focus on schemes that match:
- The farmer's crop (if mentioned)
- Farm size category
- State/district
- Irrigation method
- Any other profile details

IMPORTANT:
- Only mention real, verified government schemes
- Do NOT invent schemes, benefits, or URLs
- If unsure about a detail, say "Verify at the official website"
- List 4–6 most relevant schemes

Format clearly with scheme names as headers.`;

      const result = await askGemini(prompt);
      setAiSchemes(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI recommendation failed.');
    } finally {
      setLoadingAI(false);
    }
  };

  const toggle = (name: string) => setExpanded((e) => ({ ...e, [name]: !e[name] }));

  const categories = ['All', ...Array.from(new Set(schemes.map((s) => s.category)))];

  const filtered = schemes.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
    const matchesCat = filter === 'All' || s.category === filter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <PageHeader icon={Landmark} title="Government Schemes"
        subtitle="Find Central and Tamil Nadu state schemes relevant to your farm." />

      {/* AI Recommendations panel */}
      <GlassCard padding="lg">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-brand-600" />
            <span className="font-display font-bold text-ink-900">AI Scheme Recommendations</span>
          </div>
          <button
            onClick={fetchAIRecommendations}
            disabled={loadingAI}
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 text-white px-4 py-2 text-sm font-bold hover:bg-brand-700 transition-colors shadow-card disabled:opacity-60"
          >
            {loadingAI ? <><Loader2 size={14} className="animate-spin" /> Finding schemes…</> : <><Brain size={14} /> Get AI Recommendations</>}
          </button>
        </div>

        {!hasMemory && (
          <div className="mt-3 text-xs text-ink-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            Complete your <strong>Farm Memory profile</strong> for personalised scheme recommendations based on your crop, district, and farm size.
          </div>
        )}

        {aiError && (
          <div className="mt-3 flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            <AlertCircle size={13} className="mt-0.5 flex-shrink-0" /> {aiError}
          </div>
        )}

        {aiSchemes && (
          <div className="mt-4 p-4 bg-brand-50 border border-brand-100 rounded-2xl">
            <div className="text-xs font-bold text-brand-700 mb-2 flex items-center gap-1">
              <Brain size={12} /> Personalised recommendations based on your farm profile
            </div>
            <div className="text-sm text-ink-800 whitespace-pre-line leading-relaxed">
              {aiSchemes}
            </div>
            <div className="mt-3 text-[10px] text-ink-500">
              ⚠️ Always verify scheme details, eligibility, and deadlines at the official government portal before applying.
            </div>
          </div>
        )}
      </GlassCard>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schemes…"
            className="w-full rounded-xl bg-white border border-gray-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                filter === cat ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-ink-700 hover:border-brand-300'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-ink-500 text-sm">No schemes match your search.</div>
        )}
        {filtered.map((scheme) => (
          <GlassCard key={scheme.name} padding="lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-ink-900">{scheme.name}</h3>
                  <span className="text-[10px] font-bold bg-brand-50 text-brand-700 rounded-lg px-2 py-0.5">{scheme.category}</span>
                  <span className="text-[10px] text-ink-500 bg-gray-50 rounded-lg px-2 py-0.5">{scheme.state}</span>
                </div>
                <p className="text-sm text-ink-600 mt-1">{scheme.description}</p>
              </div>
              <button onClick={() => toggle(scheme.name)}
                className="flex-shrink-0 h-8 w-8 rounded-xl bg-brand-50 grid place-items-center hover:bg-brand-100 transition-colors">
                {expanded[scheme.name] ? <ChevronUp size={16} className="text-brand-600" /> : <ChevronDown size={16} className="text-brand-600" />}
              </button>
            </div>

            {expanded[scheme.name] && (
              <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-brand-50 border border-brand-100 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 mb-1">
                      <CheckCircle2 size={12} /> Eligibility
                    </div>
                    <p className="text-xs text-ink-700">{scheme.eligibility}</p>
                  </div>
                  <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 mb-1">
                      <Sparkles size={12} /> Benefits
                    </div>
                    <p className="text-xs text-ink-700">{scheme.benefits}</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-1">
                      <FileText size={12} /> Required Documents
                    </div>
                    <p className="text-xs text-ink-700">{scheme.documents}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <div className="text-xs font-bold text-ink-700 mb-1">How to Apply</div>
                    <p className="text-xs text-ink-600">{scheme.howToApply}</p>
                  </div>
                </div>
                {scheme.link && scheme.link !== '#' && (
                  <a href={scheme.link} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline">
                    <ExternalLink size={12} /> Official Portal: {scheme.link}
                  </a>
                )}
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      <div className="text-[11px] text-ink-400 text-center pb-2">
        Scheme details are for informational purposes. Always verify current eligibility and deadlines at official portals.
      </div>
    </div>
  );
}
