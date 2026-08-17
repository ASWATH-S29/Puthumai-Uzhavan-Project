import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  rating: number;
  image: string;
  badge?: string;
  badgeColor?: string;
}

const products: Product[] = [
  {
    id: 'p1',
    name: 'Urea Fertilizer',
    category: 'Fertilizers',
    price: '₹280',
    unit: '50 kg bag',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
    badge: 'Bestseller',
    badgeColor: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'p2',
    name: 'Paddy Seeds CR-1009',
    category: 'Seeds',
    price: '₹450',
    unit: '10 kg pack',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80',
    badge: 'Recommended',
    badgeColor: 'bg-green-50 text-green-700',
  },
  {
    id: 'p3',
    name: 'Drip Irrigation Kit',
    category: 'Equipment',
    price: '₹3,800',
    unit: '1 acre kit',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
  },
  {
    id: 'p4',
    name: 'Copper Oxychloride',
    category: 'Pesticides',
    price: '₹380',
    unit: '500 g pack',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80',
  },
];

export default function MarketplacePreview() {
  return (
    <div className="bg-white rounded-xl shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
            Marketplace
          </div>
          <div className="text-xs text-ink-600 mt-0.5">Top products for your farm</div>
        </div>
        <Link
          to="/dashboard/marketplace"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          Browse all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-gray-100 overflow-hidden hover:border-brand-200 hover:shadow-soft transition-all cursor-pointer group"
          >
            {/* Image */}
            <div className="relative h-28 overflow-hidden bg-gray-50">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80';
                }}
              />
              {p.badge && (
                <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${p.badgeColor}`}>
                  {p.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-2.5">
              <div className="text-[10px] text-ink-500 uppercase">{p.category}</div>
              <div className="text-xs font-semibold text-ink-900 mt-0.5 leading-snug truncate">{p.name}</div>
              <div className="flex items-center gap-0.5 mt-1">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] text-ink-600">{p.rating}</span>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <div className="text-sm font-bold text-ink-900">{p.price}</div>
                  <div className="text-[10px] text-ink-500">{p.unit}</div>
                </div>
                <button className="h-7 w-7 rounded-lg bg-brand-600 grid place-items-center text-white hover:bg-brand-700 transition-colors">
                  <ShoppingCart size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
