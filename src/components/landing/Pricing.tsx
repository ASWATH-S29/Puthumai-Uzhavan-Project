import { Check } from 'lucide-react';

const plans = [
  { name: 'FREE', price: '₹0', detail: 'per month', description: 'A practical starting point for your farm.', items: ['Basic farm profile', 'Weather information', 'Basic crop insights', 'Expense tracking', 'Limited AI assistance'] },
  { name: 'SMART FARM', price: '₹299', detail: 'per month', description: 'Deeper intelligence for confident decisions.', popular: true, items: ['Advanced crop recommendations', 'AI farming assistant', 'Crop health insights', 'Yield prediction', 'Advanced analytics', 'Priority insights'] },
  { name: 'ENTERPRISE', price: 'For FPOs', detail: 'and organizations', description: 'Tools that bring multiple farms together.', items: ['Multiple farms', 'Organization dashboard', 'Advanced analytics', 'Agricultural officer tools', 'Custom support'] },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Plans for every farm</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-brand-950 sm:text-4xl">Start with what you need</h2>
          <p className="mt-4 text-base text-brand-800/70">Choose the level of guidance that fits your farm today. You can always grow into more insights.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className={`relative flex flex-col rounded-3xl border p-7 ${plan.popular ? 'border-brand-500 bg-brand-950 text-white shadow-glow lg:-translate-y-2' : 'border-brand-100 bg-white shadow-soft'}`}>
              {plan.popular && <span className="absolute right-6 top-6 rounded-full bg-brand-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-950">Popular</span>}
              <p className={`text-xs font-bold tracking-[0.18em] ${plan.popular ? 'text-brand-300' : 'text-brand-600'}`}>{plan.name}</p>
              <p className="mt-6 font-display text-3xl font-extrabold">{plan.price}</p>
              <p className={`mt-1 text-sm ${plan.popular ? 'text-white/60' : 'text-brand-800/60'}`}>{plan.detail}</p>
              <p className={`mt-5 min-h-10 text-sm leading-relaxed ${plan.popular ? 'text-white/70' : 'text-brand-800/70'}`}>{plan.description}</p>
              <ul className="mt-7 flex-1 space-y-3">
                {plan.items.map((item) => <li key={item} className={`flex gap-2 text-sm ${plan.popular ? 'text-white/80' : 'text-brand-800/75'}`}><Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.popular ? 'text-brand-300' : 'text-brand-600'}`} />{item}</li>)}
              </ul>
              <a href="/signup" className={`mt-8 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${plan.popular ? 'bg-white text-brand-900 hover:bg-brand-50' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>Get Started</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
