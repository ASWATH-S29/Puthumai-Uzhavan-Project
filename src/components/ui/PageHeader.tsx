import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accent?: string;
  action?: { label: string; icon?: LucideIcon; onClick?: () => void };
}

export default function PageHeader({ icon: IconCmp, title, subtitle, accent = 'bg-brand-50 text-brand-600', action }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-lg ${accent} grid place-items-center flex-shrink-0`}>
          <IconCmp size={24} />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink-900 leading-tight">{title}</h1>
          <p className="text-sm text-ink-600 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          {action.icon && <action.icon size={17} />}
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
