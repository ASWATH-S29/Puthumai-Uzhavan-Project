import { useCallback, useEffect, useRef, useState } from 'react';

interface ApiQueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic GET hook. Runs the supplied fetcher on mount (and whenever `enabled`
 * flips to true) and tracks loading / error / data state.
 *
 * Reusable across any service function that returns a Promise<T>.
 */
export function useApiQuery<T>(fetcher: () => Promise<T>, enabled = true) {
  const [state, setState] = useState<ApiQueryState<T>>({
    data: null,
    loading: enabled,
    error: null,
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err instanceof Error ? err.message : 'Request failed' });
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    run();
  }, [enabled, run]);

  return { ...state, refetch: run };
}
