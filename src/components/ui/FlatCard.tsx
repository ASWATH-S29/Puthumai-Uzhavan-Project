import { forwardRef, type HTMLAttributes } from 'react';

type FlatCardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
};

const padMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
} as const;

/**
 * FlatCard — the design-system base card.
 * White background, soft shadow, rounded corners.
 * Replaces GlassCard across the dashboard.
 */
const FlatCard = forwardRef<HTMLDivElement, FlatCardProps>(
  ({ className = '', hover = false, padding = 'md', border = false, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-xl shadow-card
          ${border ? 'border border-gray-100' : ''}
          ${padMap[padding]}
          ${hover ? 'transition-shadow duration-200 hover:shadow-hover cursor-pointer' : ''}
          ${className}
        `}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
FlatCard.displayName = 'FlatCard';

export default FlatCard;
