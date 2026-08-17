import apiClient, { USE_MOCK } from '@/services/apiClient';
import { mockReport } from '@/services/mockData';
import type { ReportResponse } from '@/services/types';

const MOCK_DELAY = 600;

export async function getReport(): Promise<ReportResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockReport();
  }
  const { data } = await apiClient.get<ReportResponse>('/report');
  return data;
}
