interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-1">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-600">{title}</div>
        {subtitle && <div className="text-[11px] text-ink-600 mt-0.5">{subtitle}</div>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
