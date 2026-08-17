import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Droplets, Wind, CloudRain, Thermometer, MapPin, Search, Loader2, Sun, Cloud, Cloudy, AlertTriangle, Sparkles, Droplet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { fetchWeather, type WeatherData } from '@/services/weatherService';
import { useToast } from '@/components/ui/Toast';

const tooltipStyle = { borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 12 };

const iconMap: Record<string, typeof Sun> = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  partly: Cloudy,
};

function getAdvisories(weather: WeatherData['today']) {
  const advisories: Array<{ title: string; detail: string; icon: typeof AlertTriangle | typeof Sparkles | typeof Droplet | typeof CloudRain | typeof Wind }> = [];

  if ((weather.rainProbability ?? 0) >= 60) {
    advisories.push({
      title: 'Rain warning',
      detail: `Heavy chance of rain today (${weather.rainProbability}%). Delay fertilizer or pesticide spraying and keep drainage clear.`,
      icon: CloudRain,
    });
  }

  if (weather.temp >= 34) {
    advisories.push({
      title: 'Heat warning',
      detail: 'High temperature forecast. Schedule field work for early morning or late evening and keep irrigation ready.',
      icon: Sparkles,
    });
  }

  if (weather.humidity >= 80) {
    advisories.push({
      title: 'High humidity',
      detail: 'Humidity is elevated. Watch for fungal disease and avoid applying sensitive sprays until conditions improve.',
      icon: Droplet,
    });
  }

  if (weather.wind >= 40) {
    advisories.push({
      title: 'Strong wind alert',
      detail: 'Wind speeds are strong today. Secure shade, tarps, and lightweight covers before field operations.',
      icon: Wind,
    });
  }

  if (advisories.length === 0) {
    advisories.push({
      title: 'Field-ready forecast',
      detail: 'Weather looks stable for general farm work. Keep checking hourly updates before spraying or irrigation.',
      icon: Sparkles,
    });
  }

  return advisories;
}

export default function WeatherPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WeatherData | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(
    async (query: string | { lat: number; lon: number }, messageText?: string) => {
      setLoading(true);
      setError(null);
      setMessage(messageText ?? null);
      try {
        const weather = await fetchWeather(query);
        setData(weather);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load weather.';
        setError(message);
        toast(message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    loadWeather(locationInput.trim(), `Searching weather for ${locationInput.trim()}`);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setMessage('Geolocation unsupported. Search by city instead.');
      loadWeather('Thanjavur,Tamil Nadu,IN');
      return;
    }

    setMessage('Requesting location permission for local weather...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWeather({ lat: position.coords.latitude, lon: position.coords.longitude }, 'Using your device location for local weather.');
      },
      () => {
        loadWeather('Thanjavur,Tamil Nadu,IN', 'Location permission denied. Use search or default location.');
      },
      { timeout: 10000, maximumAge: 1000 * 60 * 5 },
    );
  }, [loadWeather]);

  const today = data?.today;
  const TodayIcon = today ? (iconMap[today.icon] ?? Sun) : Sun;
  const advisories = useMemo(() => (data ? getAdvisories(data.today) : []), [data]);

  return (
    <div className="space-y-6">
      <PageHeader icon={CloudSun} title="Weather" subtitle="Hyperlocal forecast and 5-day outlook for your farm." />

      {/* search */}
      <form onSubmit={handleSearch}>
        <GlassCard padding="md" className="flex items-center gap-3">
          <MapPin size={18} className="text-brand-600 flex-shrink-0" />
          <input
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Search city, e.g. Coimbatore, Tamil Nadu"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-600/60"
          />
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <><Search size={15} /> Search</>}
          </Button>
        </GlassCard>
      </form>

      {loading && (
        <GlassCard padding="lg" className="grid place-items-center py-16">
          <Loader2 size={28} className="animate-spin text-brand-600" />
          <div className="mt-3 text-sm text-ink-600">Fetching latest weather…</div>
        </GlassCard>
      )}

      {error && (
        <GlassCard padding="lg" className="bg-rose-50 border border-rose-100 text-rose-700">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="mt-0.5 text-rose-700" />
            <div>
              <div className="font-semibold">Weather unavailable</div>
              <div className="mt-1 text-sm text-rose-700">{error}</div>
            </div>
          </div>
        </GlassCard>
      )}

      {message && !error && (
        <GlassCard padding="md" className="text-sm text-ink-600">
          {message}
        </GlassCard>
      )}

      {loading && !data && (
        <GlassCard padding="lg" className="grid place-items-center py-16">
          <Loader2 size={28} className="animate-spin text-brand-600" />
          <div className="mt-3 text-sm text-ink-600">Fetching latest weather…</div>
        </GlassCard>
      )}

      {data && !loading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="relative overflow-hidden rounded-2xl bg-brand-600 p-6 sm:p-8 text-white shadow-card">
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-brand-400/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-accent-400/20 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-brand-100 text-sm">
                  <MapPin size={14} /> {data.location}
                </div>
                <div className="mt-3 flex items-end gap-3">
                  <TodayIcon size={56} className="text-white" />
                  <div>
                    <div className="font-display font-extrabold text-6xl leading-none">{today!.temp}°</div>
                    <div className="text-brand-100 mt-1 capitalize">{today!.condition}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-brand-100">Feels like {today!.feelsLike}°C</div>
                <div className="mt-2 text-sm text-brand-100/80 flex flex-wrap gap-4">
                  {today?.sunrise && <span>Sunrise {today.sunrise}</span>}
                  {today?.sunset && <span>Sunset {today.sunset}</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:w-72">
                {[
                  { icon: Droplets, label: 'Humidity', value: `${today!.humidity}%` },
                  { icon: Wind, label: 'Wind', value: `${today!.wind} km/h` },
                  { icon: CloudRain, label: 'Rain prob.', value: `${today!.rainProbability ?? 0}%` },
                  { icon: Thermometer, label: 'Pressure', value: `${today!.pressure ?? 0} hPa` },
                ].map((m) => (
                  <div key={m.label} className="rounded-2xl bg-white/10 p-3">
                    <m.icon size={18} className="text-brand-200" />
                    <div className="mt-1.5 text-[11px] text-brand-100">{m.label}</div>
                    <div className="font-bold text-sm">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <GlassCard padding="lg">
            <div className="font-display font-bold text-ink-900">Weather Advisory</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {advisories.map((advice) => (
                <div key={advice.title} className="rounded-3xl border border-slate-100 p-4 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <advice.icon size={18} className="text-brand-600" />
                    <div className="font-semibold text-ink-900">{advice.title}</div>
                  </div>
                  <div className="mt-2 text-sm text-ink-600">{advice.detail}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div>
            <div className="font-display font-bold text-ink-900 mb-3">5-Day Forecast</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {data.forecast.map((d, i) => {
                const Icon = iconMap[d.icon] ?? Sun;
                return (
                  <motion.div key={`${d.day}-${i}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <GlassCard padding="sm" hover className="text-center h-full">
                      <div className="text-xs font-bold text-ink-600 uppercase">{d.day}</div>
                      <div className="mx-auto mt-3 h-12 w-12 rounded-2xl bg-brand-50 grid place-items-center">
                        <Icon size={24} className="text-brand-600" />
                      </div>
                      <div className="mt-3 font-display font-bold text-lg text-ink-900">{d.tempHi}°</div>
                      <div className="text-xs text-ink-600">{d.tempLo}°</div>
                      <div className="mt-2 text-[10px] text-ink-600 capitalize truncate">{d.condition}</div>
                      <div className="mt-2 text-[10px] text-ink-600">{d.rainProbability ?? 0}% rain</div>
                      <div className="mt-1 text-[10px] text-ink-500">{d.humidity}% · {d.wind} km/h</div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <GlassCard padding="lg">
            <div className="font-display font-bold text-ink-900">Temperature Trend</div>
            <div className="text-xs text-ink-600 mt-0.5">High & low across the week (°C)</div>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.forecast} margin={{ top: 5, right: 10, left: -18, bottom: 0 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6f0ea" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7d72' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}°C`} cursor={{ fill: 'rgba(34,197,94,0.06)' }} />
                  <Bar dataKey="tempHi" radius={[6, 6, 0, 0]} name="High">
                    {data.forecast.map((_, i) => (
                      <Cell key={i} fill="#f59e0b" />
                    ))}
                  </Bar>
                  <Bar dataKey="tempLo" radius={[6, 6, 0, 0]} name="Low">
                    {data.forecast.map((_, i) => (
                      <Cell key={i} fill="#0ea5e9" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
