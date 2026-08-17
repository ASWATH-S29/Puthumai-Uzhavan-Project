import apiClient, { USE_MOCK } from '@/services/apiClient';
import { mockDashboard } from '@/services/mockData';
import type { DashboardResponse } from '@/services/types';

const MOCK_DELAY = 700;

export async function getDashboard(): Promise<DashboardResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockDashboard();
  }
  const { data } = await apiClient.get<DashboardResponse>('/dashboard');
  return data;
}
