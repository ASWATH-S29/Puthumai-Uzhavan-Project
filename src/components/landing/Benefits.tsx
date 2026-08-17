import { BrainCircuit, CloudSun, Sprout, Wallet } from 'lucide-react';

const benefits = [
  {
    icon: Sprout,
    title: 'Better crop decisions',
    desc: 'Bring crop recommendations and farm information together so you can plan with more confidence.',
  },
  {
    icon: CloudSun,
    title: 'Weather-aware planning',
    desc: 'Use current weather and forecasts to make better day-to-day farming decisions.',
  },
  {
    icon: Wallet,
    title: 'Clearer farm finances',
    desc: 'Track expenses and understand your farm economics from one place.',
  },
  {
    icon: BrainCircuit,
    title: 'Practical AI guidance',
    desc: 'Ask the farming assistant for clear, context-aware guidance when you need it.',
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="bg-brand-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Why Puthumai Uzhavan
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand-950 sm:text-4xl">
            Practical intelligence for everyday farming
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-800/70">
            Put the information you already need into one clear, farmer-focused workspace.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="rounded-2xl border border-brand-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-brand-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-800/70">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
