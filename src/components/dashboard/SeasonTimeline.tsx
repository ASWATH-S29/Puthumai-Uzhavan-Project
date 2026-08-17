import { motion } from 'framer-motion';
import Card from '@/components/ui/GlassCard';
import Icon from '@/components/ui/Icon';
import { seasonTimeline } from '@/data/dummyData';

const phaseColor: Record<string, string> = {
  Preparation: 'bg-brand-600',
  Growth: 'bg-emerald-600',
  Weather: 'bg-sky-600',
  Treatment: 'bg-amber-600',
  Harvest: 'bg-orange-600',
  Income: 'bg-brand-700',
};

export default function SeasonTimeline() {
  return (
    <Card padding="lg">
      <div className="font-display font-bold text-ink-900">Season Timeline</div>
      <div className="text-xs text-ink-600 mt-0.5">Complete journey from sowing to harvest</div>

      <div className="mt-6 relative">
        <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gray-200" />
        <div className="space-y-5">
          {seasonTimeline.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex gap-4"
            >
              <div className="relative z-10 flex-shrink-0">
                <div className={`h-9 w-9 rounded-lg grid place-items-center text-white ${phaseColor[ev.phase] ?? 'bg-brand-600'}`}>
                  <Icon name={ev.icon} size={17} />
                </div>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-ink-600">{ev.phase}</span>
                  <span className="text-[11px] text-ink-600">{ev.date}</span>
                </div>
                <div className="mt-1 font-bold text-ink-900">{ev.title}</div>
                <p className="text-sm text-ink-600 leading-relaxed mt-0.5">{ev.description}</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-brand-50 border border-brand-100 px-3 py-1.5">
                  <span className="font-display font-bold text-brand-700 text-sm">{ev.metric}</span>
                  <span className="text-[11px] text-ink-600">{ev.metricLabel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
