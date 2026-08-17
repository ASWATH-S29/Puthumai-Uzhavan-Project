import { forwardRef, type HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
};

const padMap = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
} as const;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hover = false, padding = 'md', children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl shadow-card ${padMap[padding]} ${hover ? 'transition-shadow duration-200 hover:shadow-hover' : ''} ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = 'Card';

export default Card;
