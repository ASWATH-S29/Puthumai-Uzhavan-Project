interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  showText?: boolean;
}

const sizes = {
  sm: { box: 'h-9 w-9', title: 'text-base', sub: 'text-[10px]' },
  md: { box: 'h-11 w-11', title: 'text-lg', sub: 'text-[11px]' },
  lg: { box: 'h-14 w-14', title: 'text-2xl', sub: 'text-xs' },
} as const;

export default function Logo({ size = 'md', variant = 'dark', showText = true }: LogoProps) {
  const s = sizes[size];
  const titleColor = variant === 'light' ? 'text-white' : 'text-ink-900';
  const subColor = variant === 'light' ? 'text-white/70' : 'text-brand-600';

  return (
    <div className="flex items-center gap-3">
      <img
        src="/assets/image.png"
        alt="Puthumai Uzhavan agriculture and AI logo"
        className={`${s.box} flex-shrink-0 rounded-full object-contain`}
      />
      {showText && (
        <div className="leading-tight">
          <div className={`${s.title} font-display font-extrabold ${titleColor}`}>புதுமை உழவன்</div>
          <div className={`${s.sub} font-semibold tracking-wide ${subColor}`}>PUTHUMAI UZHAVAN</div>
        </div>
      )}
    </div>
  );
}
