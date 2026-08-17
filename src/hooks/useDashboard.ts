import { useApiQuery } from '@/hooks/useApiQuery';
import { getDashboard } from '@/services/dashboardService';
import type { DashboardResponse } from '@/services/types';

export function useDashboard() {
  return useApiQuery<DashboardResponse>(getDashboard);
}
