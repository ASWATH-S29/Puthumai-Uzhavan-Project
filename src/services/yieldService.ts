import apiClient, { USE_MOCK } from '@/services/apiClient';
import { mockYield } from '@/services/mockData';
import type { YieldRequest, YieldResponse } from '@/services/types';

const MOCK_DELAY = 800;

export async function predictYield(payload: YieldRequest): Promise<YieldResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockYield();
  }
  const { data } = await apiClient.post<YieldResponse>('/yield', payload);
  return data;
}
