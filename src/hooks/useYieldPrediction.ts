import { useCallback } from 'react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { predictYield } from '@/services/yieldService';
import type { YieldRequest, YieldResponse } from '@/services/types';

export function useYieldPrediction() {
  return useApiMutation<YieldResponse, YieldRequest>(useCallback(predictYield, []));
}
