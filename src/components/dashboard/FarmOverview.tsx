import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFarms } from '@/hooks/useFarms';

const healthColor = (h: number) =>
  h >= 85
    ? { bg: 'bg-green-50', text: 'text-green-700', bar: '#16a34a' }
    : h >= 75
    ? { bg: 'bg-amber-50', text: 'text-amber-700', bar: '#d97706' }
    : { bg: 'bg-red-50', text: 'text-red-600', bar: '#ef4444' };

const cropEmoji: Record<string, string> = {
  Paddy: '🌾',
  Tomato: '🍅',
  Sugarcane: '🌿',
  Banana: '🍌',
  Rice: '🌾',
  Maize: '🌽',
  Cotton: '🌿',
};

export default function FarmOverview() {
  const { user } = useAuth();

  // Get farms from hook
  const { data, loading, error } = useFarms(user?.id);

  // Prevent null crash
  const farms = Array.isArray(data) ? data : [];

  // Calculate total acreage safely
  const totalAcreage = farms.reduce(
    (sum, farm) => sum + Number(farm.area || 0),
    0
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Farm Overview</h2>
          <p className="text-sm text-gray-500">
            {farms.length} farms · {totalAcreage.toFixed(1)} acres
          </p>
        </div>

        <Link
          to="/app/farms"
          className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Farm list */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 size={16} className="animate-spin" />
            Loading farms...
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">
            {typeof error === 'string'
              ? error
              : 'Failed to load farms.'}
          </div>
        ) : farms.length === 0 ? (
          <div className="text-sm text-gray-600">
            No farms found. Add your first farm to get started.
          </div>
        ) : (
          farms.map((farm) => {
            const c = healthColor(Number(farm.health || 0));

            return (
              <div
                key={farm.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                  {cropEmoji[farm.crop] ?? '🌱'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm truncate">
                      {farm.name}
                    </span>

                    <span className={`text-xs font-bold ${c.text}`}>
                      {farm.health}%
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {farm.crop} • {farm.area} ac • {farm.status}
                  </div>

                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${farm.health}%`,
                        background: c.bar,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}