import GlassCard from '@/components/ui/GlassCard';

interface SkeletonProps {
  variant?: 'card' | 'line' | 'circle';
  className?: string;
  count?: number;
}

export function Skeleton({ variant = 'line', className = '' }: Omit<SkeletonProps, 'count'>) {
  const base = 'bg-gray-100 animate-pulse';
  if (variant === 'circle') return <div className={`${base} rounded-full ${className}`} />;
  if (variant === 'card') return <div className={`${base} rounded-xl ${className}`} />;
  return <div className={`${base} rounded-lg h-4 ${className}`} />;
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <GlassCard key={i} padding="lg" className="h-full">
          <div className="flex items-center justify-between">
            <Skeleton className="w-24" />
            <Skeleton variant="circle" className="h-10 w-10" />
          </div>
          <Skeleton className="w-36 h-8 mt-4" />
          <Skeleton className="w-20 mt-2" />
        </GlassCard>
      ))}
    </>
  );
}

export default Skeleton;
