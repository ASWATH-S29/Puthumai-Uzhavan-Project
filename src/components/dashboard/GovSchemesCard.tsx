import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface Scheme {
  id: string;
  title: string;
  ministry: string;
  benefit: string;
  eligible: boolean;
  image: string;
  tag: string;
  tagColor: string;
}

const schemes: Scheme[] = [
  {
    id: 's1',
    title: 'PM-KISAN Samman Nidhi',
    ministry: 'Ministry of Agriculture',
    benefit: '₹6,000/year direct income support',
    eligible: true,
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80',
    tag: 'Direct Benefit',
    tagColor: 'bg-green-50 text-green-700',
  },
  {
    id: 's2',
    title: 'Pradhan Mantri Fasal Bima',
    ministry: 'Ministry of Agriculture',
    benefit: 'Crop insurance at 2% premium',
    eligible: true,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80',
    tag: 'Insurance',
    tagColor: 'bg-sky-50 text-sky-700',
  },
  {
    id: 's3',
    title: 'Soil Health Card Scheme',
    ministry: 'Dept. of Agriculture',
    benefit: 'Free soil testing & nutrient advice',
    eligible: false,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
    tag: 'Advisory',
    tagColor: 'bg-amber-50 text-amber-700',
  },
];

export default function GovSchemesCard() {
  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
            Government Schemes
          </div>
          <div className="text-xs text-ink-600 mt-0.5">Schemes you may qualify for</div>
        </div>
        <Link
          to="/dashboard/schemes"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          All schemes <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {schemes.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-gray-100 overflow-hidden hover:border-brand-200 hover:shadow-soft transition-all"
          >
            {/* Image */}
            <div className="h-28 overflow-hidden">
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80';
                }}
              />
            </div>

            {/* Content */}
            <div className="p-3">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${s.tagColor}`}>
                {s.tag}
              </span>
              <div className="font-semibold text-sm text-ink-900 mt-1.5 leading-snug">
                {s.title}
              </div>
              <div className="text-[11px] text-ink-500 mt-0.5">{s.ministry}</div>
              <div className="text-xs text-ink-700 mt-2 leading-snug">{s.benefit}</div>

              <div className="mt-3 flex items-center justify-between">
                {s.eligible ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700">
                    <CheckCircle size={11} /> Eligible
                  </span>
                ) : (
                  <span className="text-[10px] text-ink-500">Check eligibility</span>
                )}
                <button className="text-[11px] font-semibold text-brand-600 hover:text-brand-700">
                  Apply →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
