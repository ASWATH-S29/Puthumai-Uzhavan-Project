import apiClient, { USE_MOCK } from '@/services/apiClient';
import { mockChat } from '@/services/mockData';
import type { ChatRequest, ChatResponse } from '@/services/types';

const MOCK_DELAY = 1200;

export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockChat(payload.message);
  }
  const { data } = await apiClient.post<ChatResponse>('/chat', payload);
  return data;
}
