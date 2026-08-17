import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getRecommendationHistory } from '@/services/cropService';
import type { RecommendationHistoryRow } from '@/services/types';

interface RecommendationContextValue {
  recommendations: RecommendationHistoryRow[];
  loading: boolean;
  error: string | null;
  refreshRecommendations: () => Promise<void>;
  addRecommendation: (item: RecommendationHistoryRow) => void;
}

const RecommendationContext = createContext<RecommendationContextValue | undefined>(undefined);

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshRecommendations = useCallback(async () => {
    if (!user?.id) {
      setRecommendations([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendationHistory(user.id);
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load recommendations');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void refreshRecommendations();
  }, [refreshRecommendations]);

  const addRecommendation = useCallback((item: RecommendationHistoryRow) => {
    setRecommendations((current) => [item, ...current]);
  }, []);

  const value = useMemo<RecommendationContextValue>(() => ({
    recommendations,
    loading,
    error,
    refreshRecommendations,
    addRecommendation,
  }), [addRecommendation, error, loading, recommendations, refreshRecommendations]);

  return <RecommendationContext.Provider value={value}>{children}</RecommendationContext.Provider>;
}

export function useRecommendationsContext() {
  const ctx = useContext(RecommendationContext);
  if (!ctx) throw new Error('useRecommendationsContext must be used within RecommendationProvider');
  return ctx;
}
