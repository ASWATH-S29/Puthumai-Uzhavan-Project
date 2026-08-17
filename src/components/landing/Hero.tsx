import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  TrendingUp,
  Sun,
  Cloud,
  MapPin,
} from 'lucide-react';

type ForecastDay = {
  day: string;
  icon: 'sun' | 'cloud' | 'rain';
  high: number;
  low: number;
};

const forecastDays: ForecastDay[] = [
  { day: 'Mon', icon: 'sun', high: 33, low: 24 },
  { day: 'Tue', icon: 'cloud', high: 31, low: 23 },
  { day: 'Wed', icon: 'rain', high: 28, low: 22 },
  { day: 'Thu', icon: 'sun', high: 32, low: 25 },
  { day: 'Fri', icon: 'cloud', high: 30, low: 23 },
];

function ForecastIcon({ kind, className }: { kind: ForecastDay['icon']; className?: string }) {
  if (kind === 'sun') return <Sun className={className} />;
  if (kind === 'cloud') return <Cloud className={className} />;
  return <CloudRain className={className} />;
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-earth-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — headline */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Smart farming for every season
            </span>

            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl text-balance">
              Grow more with{' '}
              <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
                data-driven
              </span>{' '}
              farming
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-800/70 sm:text-lg">
              Puthumai Uzhavan brings live weather, crop insights and profit
              forecasting to your fingertips — so every decision in the field is
              backed by real-time intelligence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-700 hover:shadow-glow active:scale-[0.98]">
                Get started free
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-6 py-3.5 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 active:scale-[0.98]">
                See how it works
              </a>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-700/60">
                  Platform
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-brand-900">
                  Smart
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-700/60">
                  Built for farmers
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-brand-900">
                  Connected
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-700/60">
                  Intelligence
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-brand-900">
                  AI
                </dd>
              </div>
            </dl>
          </div>

          {/* RIGHT — weather / insight dashboard */}
          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="relative mx-auto w-full max-w-md rounded-3xl border border-brand-100 bg-white/90 p-5 shadow-card backdrop-blur-sm sm:p-6 lg:max-w-lg">
              {/* header row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                    <CloudSun className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-900">
                      Farm Dashboard
                    </p>
                    <p className="flex items-center gap-1 text-xs text-brand-700/60">
                      <MapPin className="h-3 w-3" /> Thanjavur, Tamil Nadu
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                  Live
                </span>
              </div>

              {/* WEATHER SUMMARY — temperature + status in their own columns */}
              <div className="mt-5 flex items-stretch gap-4 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-5">
                {/* temperature column */}
                <div className="flex shrink-0 flex-col justify-center">
                  <div className="flex items-start">
                    <span className="font-display text-5xl font-extrabold leading-none text-brand-700 sm:text-6xl">
                      31
                    </span>
                    <span className="mt-1 text-2xl font-bold text-brand-500">
                      °C
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-brand-800">
                    Partly Cloudy
                  </p>
                </div>

                {/* divider */}
                <div className="w-px shrink-0 bg-brand-200/70" />

                {/* status column */}
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-brand-700/60">
                    Current conditions
                  </p>
                  <p className="text-sm leading-snug text-brand-800/80">
                    Warm and humid with intermittent sunshine. Good for paddy
                    irrigation scheduling.
                  </p>
                </div>
              </div>

              {/* HUMIDITY / WIND / RAIN — three equal cards */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-brand-100 bg-white p-3.5">
                  <div className="flex items-center gap-1.5 text-brand-600">
                    <Droplets className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-700/60">
                      Humidity
                    </span>
                  </div>
                  <p className="mt-2 font-display text-xl font-bold text-brand-900">
                    92%
                  </p>
                </div>
                <div className="rounded-xl border border-brand-100 bg-white p-3.5">
                  <div className="flex items-center gap-1.5 text-brand-600">
                    <Wind className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-700/60">
                      Wind
                    </span>
                  </div>
                  <p className="mt-2 font-display text-xl font-bold text-brand-900">
                    14 km/h
                  </p>
                </div>
                <div className="rounded-xl border border-brand-100 bg-white p-3.5">
                  <div className="flex items-center gap-1.5 text-brand-600">
                    <CloudRain className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-700/60">
                      Rain
                    </span>
                  </div>
                  <p className="mt-2 font-display text-xl font-bold text-brand-900">
                    18%
                  </p>
                </div>
              </div>

              {/* 5-DAY FORECAST — own section, equal-width cards */}
              <div className="mt-5">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-brand-700/60">
                  5-day forecast
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {forecastDays.map((d) => (
                    <div
                      key={d.day}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-100 bg-white px-1.5 py-3 text-center"
                    >
                      <span className="text-[11px] font-semibold text-brand-800">
                        {d.day}
                      </span>
                      <ForecastIcon
                        kind={d.icon}
                        className="h-5 w-5 text-brand-500"
                      />
                      <span className="text-xs font-bold text-brand-900">
                        {d.high}°
                      </span>
                      <span className="text-[11px] text-brand-700/50">
                        {d.low}°
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROFIT INDICATOR — its own section, separated from forecast */}
              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-white">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Projected monthly profit
                  </p>
                  <p className="mt-1.5 font-display text-2xl font-extrabold sm:text-3xl">
                    ₹69,000
                  </p>
                  <p className="mt-0.5 text-xs text-white/70">
                    Based on current yield & market price
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
                    +12.4%
                  </span>
                  <span className="mt-1.5 text-[11px] text-white/60">
                    vs last month
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
