import { useCallback } from 'react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { scanCrop } from '@/services/scannerService';
import type { ScannerRequest, ScannerResponse } from '@/services/types';

export function useScanner() {
  return useApiMutation<ScannerResponse, ScannerRequest>(useCallback(scanCrop, []));
}
