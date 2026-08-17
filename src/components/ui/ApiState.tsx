import { AlertCircle, RefreshCw } from 'lucide-react';

type Variant = 'card' | 'inline';

interface ApiStateProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  variant?: Variant;
  className?: string;
}

export function LoadingState({ variant = 'card', className = '' }: { variant?: Variant; className?: string }) {
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 text-sm text-ink-600 ${className}`}>
        <RefreshCw size={15} className="animate-spin text-brand-600" /> Loading…
      </div>
    );
  }
  return (
    <div className={`bg-white rounded-xl shadow-card p-8 grid place-items-center ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <RefreshCw size={22} className="animate-spin text-brand-600" />
        <span className="text-sm font-semibold text-ink-600">Loading…</span>
      </div>
    </div>
  );
}

export function ErrorState({ error, onRetry, variant = 'card', className = '' }: Omit<ApiStateProps, 'loading'>) {
  const content = (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="h-12 w-12 rounded-lg bg-red-50 grid place-items-center">
        <AlertCircle size={22} className="text-error-600" />
      </div>
      <div className="text-sm font-semibold text-ink-900">{error || 'Something went wrong'}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-bold hover:bg-brand-700 transition-colors"
        >
          <RefreshCw size={15} /> Try again
        </button>
      )}
    </div>
  );
  if (variant === 'inline') {
    return <div className={`flex items-center gap-2 text-sm text-error-600 ${className}`}>{content}</div>;
  }
  return <div className={`bg-white rounded-xl shadow-card p-8 grid place-items-center ${className}`}>{content}</div>;
}

export default function ApiState({ loading, error, onRetry, variant = 'card', className = '' }: ApiStateProps) {
  if (loading) return <LoadingState variant={variant} className={className} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} variant={variant} className={className} />;
  return null;
}
