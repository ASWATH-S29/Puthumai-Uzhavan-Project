import { useCallback } from 'react';
import { useApiMutation } from '@/hooks/useApiMutation';
import { sendChatMessage } from '@/services/chatService';
import type { ChatRequest, ChatResponse } from '@/services/types';

export function useChat() {
  return useApiMutation<ChatResponse, ChatRequest>(useCallback(sendChatMessage, []));
}
