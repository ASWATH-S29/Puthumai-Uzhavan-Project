import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { testimonials } from '@/data/dummyData';
import Stars from '@/components/ui/Stars';

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-600">Testimonials</span>
          <h2 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl text-ink-900 text-balance">
            Trusted by farmers across Tamil Nadu
          </h2>
          <p className="mt-4 text-ink-800/70 text-lg">
            From paddy to horticulture, our members put the platform to work every single day.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl p-7 shadow-glass hover:shadow-glass-lg transition-shadow flex flex-col"
            >
              <Quote className="text-brand-300" size={32} />
              <p className="mt-4 text-ink-800/80 leading-relaxed flex-1">"{t.quote}"</p>
              <Stars rating={t.rating} className="mt-5" />
              <div className="mt-4 flex items-center gap-3">
                <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${t.accent} grid place-items-center text-white font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-ink-900">{t.name}</div>
                  <div className="text-sm text-ink-800/60">{t.role} · {t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
