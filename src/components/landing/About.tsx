import { BrainCircuit, HandHeart, Leaf, Sprout } from 'lucide-react';

const principles = [
  { icon: Sprout, title: 'Our Mission', desc: 'Help farmers make better, more confident decisions with useful information at the right time.' },
  { icon: Leaf, title: 'What We Provide', desc: 'Weather intelligence, crop recommendations, health monitoring, expense tracking, and yield insights in one place.' },
  { icon: HandHeart, title: 'Built for Indian Agriculture', desc: 'Designed around the realities of Indian farms, seasons, markets, and the people who grow our food.' },
  { icon: BrainCircuit, title: 'AI + Agriculture', desc: 'Bring modern intelligence closer to the field while keeping every experience clear and practical.' },
];

export default function About() {
  return (
    <section id="about" className="bg-brand-50/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">About the platform</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-brand-950 sm:text-4xl">About Puthumai Uzhavan</h2>
            <p className="mt-5 text-base leading-relaxed text-brand-800/75">Puthumai Uzhavan is an AI-powered smart farming platform designed to help Indian farmers make better decisions using farm data, weather intelligence, crop recommendations, crop health monitoring, expense tracking and yield insights.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {principles.map(({ icon: Icon, title, desc }) => <div key={title} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-soft"><Icon className="h-6 w-6 text-brand-600" /><h3 className="mt-4 font-bold text-brand-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-brand-800/70">{desc}</p></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
