import { Star } from 'lucide-react';

interface StarsProps {
  rating: number;
  className?: string;
}

export default function Stars({ rating, className = '' }: StarsProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
        />
      ))}
    </div>
  );
}
