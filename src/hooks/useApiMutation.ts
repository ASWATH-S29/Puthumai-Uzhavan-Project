import { useCallback, useState } from 'react';

interface ApiMutationState<T, V> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: (variables: V) => Promise<T>;
  reset: () => void;
}

/**
 * Generic mutation hook for POST/PUT/DELETE service calls.
 * Call `mutate(payload)` to fire the request; loading/error/data track the result.
 */
export function useApiMutation<T, V>(mutator: (variables: V) => Promise<T>): ApiMutationState<T, V> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: V): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const result = await mutator(variables);
        setData(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Request failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutator],
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, mutate, reset };
}
