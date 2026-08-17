import {
  CloudSun,
  TrendingUp,
  Sprout,
  ScanLine,
  Wallet,
  BrainCircuit,
} from 'lucide-react';

const features = [
  {
    icon: Sprout,
    title: 'AI Crop Recommendations',
    desc: 'Get practical suggestions on what to plant and when, matched to your soil and season.',
  },
  {
    icon: CloudSun,
    title: 'Live Weather & Forecasts',
    desc: 'Hyper-local forecasts and conditions tailored to your fields, updated in real time.',
  },
  {
    icon: ScanLine,
    title: 'Crop Health Monitoring',
    desc: 'Track crop health and catch pests or disease early, before they spread.',
  },
  {
    icon: Wallet,
    title: 'Expense Tracking',
    desc: 'Keep a clear record of inputs and costs so you always know where you stand.',
  },
  {
    icon: TrendingUp,
    title: 'Yield Prediction',
    desc: 'See projected yields based on current conditions to plan harvest and sales.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Farming Assistant',
    desc: 'Ask questions and get clear, context-aware guidance for everyday farm decisions.',
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Everything you need
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand-950 sm:text-4xl text-balance">
            One platform for the entire farming lifecycle
          </h2>
          <p className="mt-4 text-base text-brand-800/70">
            From planting to harvest to market, Puthumai Uzhavan puts the right
            information in your hands at every step.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-brand-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-brand-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-800/70">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
