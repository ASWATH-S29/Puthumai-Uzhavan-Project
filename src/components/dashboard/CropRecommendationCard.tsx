import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, TrendingUp, BarChart2, ArrowRight, Award } from 'lucide-react';
import { useRecommendationsContext } from '@/context/RecommendationContext';

// Unsplash-based crop images (free to use)
const cropImages: Record<string, string> = {
  Paddy:       'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80',
  'Black Gram':'https://images.unsplash.com/photo-1612257416648-2d6a5cbe4ebd?w=400&q=80',
  Maize:       'https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?w=400&q=80',
  Groundnut:   'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80',
};

export default function CropRecommendationCard() {
  const { recommendations } = useRecommendationsContext();
  const top = useMemo(() => recommendations[0], [recommendations]);
  const img = top ? cropImages[top.recommended_crop] ?? cropImages['Paddy'] : cropImages['Paddy'];

  if (!top) {
    return (
      <div className="bg-white rounded-xl shadow-card overflow-hidden h-full flex flex-col p-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500 mb-3">AI Crop Recommendation</div>
        <div className="text-sm text-ink-600">No recommendation available yet.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden h-full flex flex-col">
      {/* Crop image */}
      <div className="relative h-36 flex-shrink-0">
        <img
          src={img}
          alt={top.recommended_crop}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Best match badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-md px-2 py-1">
          <Award size={11} />
          Best Match
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="text-white font-display font-bold text-lg leading-tight">{top.recommended_crop}</div>
          <div className="text-white/80 text-xs">{top.season ?? 'Season ready'}</div>
        </div>
        <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-center">
          <div className="text-white font-bold text-sm">{Math.round(Number(top.profit_estimate ?? 0) / 1000)}k</div>
          <div className="text-white/80 text-[10px]">Score</div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500 mb-3">
          AI Crop Recommendation
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <Droplets size={14} className="mx-auto text-sky-500 mb-1" />
            <div className="text-xs font-bold text-ink-800">{top.required_water ?? 'Medium'}</div>
            <div className="text-[10px] text-ink-500">Water</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <TrendingUp size={14} className="mx-auto text-green-600 mb-1" />
            <div className="text-xs font-bold text-ink-800">
              ₹{Math.round((top.profit_estimate ?? 0) / 1000)}k
            </div>
            <div className="text-[10px] text-ink-500">Profit/ac</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <BarChart2 size={14} className="mx-auto text-brand-600 mb-1" />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-700">
              High
            </span>
            <div className="text-[10px] text-ink-500 mt-0.5">Demand</div>
          </div>
        </div>

        <p className="text-xs text-ink-600 leading-relaxed flex-1">{top.fertilizer_advice ?? 'Recommendation generated from your farm conditions.'}</p>

        <Link
          to="/dashboard/crops"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-white py-2.5 text-xs font-semibold hover:bg-brand-700 transition-colors"
        >
          View All Recommendations <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
