import { useCallback } from 'react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { recommendCrops } from '@/services/cropService';
import type { CropRecommendRequest, CropRecommendResponse } from '@/services/types';

export function useCropRecommendation() {
  return useApiMutation<CropRecommendResponse, CropRecommendRequest>(
    useCallback(recommendCrops, []),
  );
}
