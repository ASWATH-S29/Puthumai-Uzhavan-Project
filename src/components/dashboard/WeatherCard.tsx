import { useEffect, useState } from 'react';
import { CloudRain, Droplets, Wind, Sun, CloudSun, Umbrella, Loader2, AlertTriangle } from 'lucide-react';
import { fetchWeather, type WeatherData } from '@/services/weatherService';

const ForecastIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case 'rain':
      return <CloudRain size={16} className="text-sky-500" />;
    case 'cloud':
      return <CloudSun size={16} className="text-gray-400" />;
    case 'partly':
      return <CloudSun size={16} className="text-amber-400" />;
    default:
      return <Sun size={16} className="text-amber-400" />;
  }
};

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeather('Thanjavur,Tamil Nadu,IN');
        if (active) setWeather(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load weather data.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const today = weather?.today;
  const rainProbability = today?.rainProbability ?? 0;

  return (
    <div className="bg-white rounded-xl shadow-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500">Weather Overview</div>
          <div className="text-xs text-ink-600 mt-0.5">📍 {weather?.location ?? 'Thanjavur, Tamil Nadu'}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-sky-50 grid place-items-center">
          <CloudSun size={20} className="text-sky-500" />
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center py-16 gap-3 text-ink-600">
          <Loader2 size={24} className="animate-spin" />
          Loading weather…
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-rose-700">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} />
            <div>
              <div className="font-semibold">Weather unavailable</div>
              <div className="text-xs mt-1">{error}</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-3">
            <div>
              <div className="font-display font-bold text-5xl text-ink-900 leading-none">{today?.temp ?? '--'}°</div>
              <div className="text-sm font-medium text-ink-600 mt-1 capitalize">{today?.condition ?? 'Loading'}</div>
              <div className="text-xs text-ink-500">Feels like {today?.feelsLike ?? '--'}°C</div>
            </div>
            <div className="flex-1" />
            <div className="text-right">
              <div className="text-[11px] text-ink-500">Rain prob.</div>
              <div className="text-lg font-bold text-sky-600">{rainProbability}%</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { Icon: Droplets, label: 'Humidity', value: `${today?.humidity ?? '--'}%`, color: 'text-sky-500' },
              { Icon: Wind, label: 'Wind', value: `${today?.wind ?? '--'} km/h`, color: 'text-brand-500' },
              { Icon: Umbrella, label: 'Pressure', value: `${today?.pressure ?? '--'} hPa`, color: 'text-violet-500' },
            ].map(({ Icon, label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-2.5 text-center">
                <Icon size={15} className={`mx-auto ${color}`} />
                <div className="text-xs font-bold text-ink-800 mt-1">{value}</div>
                <div className="text-[10px] text-ink-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-500 mb-2">7-Day Forecast</div>
            <div className="flex items-center justify-between gap-1">
              {weather?.forecast.slice(0, 5).map((d) => (
                <div key={d.day} className="flex-1 text-center rounded-lg bg-gray-50 py-2">
                  <div className="text-[10px] font-semibold text-ink-600">{d.day}</div>
                  <div className="my-1.5 flex justify-center">
                    <ForecastIcon icon={d.icon} />
                  </div>
                  <div className="text-xs font-bold text-ink-900">{d.tempHi}°</div>
                  <div className="text-[10px] text-ink-500">{d.tempLo}°</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
