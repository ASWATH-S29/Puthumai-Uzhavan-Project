const steps = [
  {
    num: '01',
    title: 'Set up your farm',
    desc: 'Add your land, crops and location once. We tailor every insight to your specific farm.',
  },
  {
    num: '02',
    title: 'Get live insights',
    desc: 'Weather, crop health and profit projections update automatically as conditions change.',
  },
  {
    num: '03',
    title: 'Act with confidence',
    desc: 'Receive timely recommendations and alerts so you always know the right next step.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-brand-50/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Simple to start
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand-950 sm:text-4xl text-balance">
            Up and running in three steps
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-0 top-8 hidden h-px w-full bg-brand-200 md:block" />
              )}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 font-display text-xl font-bold text-white shadow-card">
                {s.num}
              </div>
              <h3 className="mt-5 text-lg font-bold text-brand-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-800/70">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
