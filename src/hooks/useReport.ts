import { useApiQuery } from '@/hooks/useApiQuery';
import { getReport } from '@/services/reportService';
import type { ReportResponse } from '@/services/types';

export function useReport() {
  return useApiQuery<ReportResponse>(getReport);
}
