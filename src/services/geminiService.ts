/**
 * geminiService.ts
 * ─────────────────────────────────────────────────────────────
 * Wraps calls to the Supabase Edge Function `ai-chat` so the
 * Gemini API key never reaches the browser.
 * ─────────────────────────────────────────────────────────────
 */

import type { ChatMessage } from '@/data/dummyData';
import type { FarmAIContext } from '@/services/aiContextService';

export interface GeminiSession {
  sendMessage: (text: string) => Promise<string>;
}

function getFunctionUrl(): string {
  const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
  return `${supabaseUrl}/functions/v1/ai-chat`;
}

function getAuthHeaders(): Record<string, string> {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${anonKey}`,
    apikey: anonKey,
  };
}

interface EdgeChatResponse {
  text?: string;
  error?: string;
}

async function callEdgeFunction(payload: Record<string, unknown>): Promise<string> {
  const url = getFunctionUrl();
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Unable to reach the AI service. Check your internet connection and try again.');
  }

  let data: EdgeChatResponse | null = null;
  try {
    data = (await res.json()) as EdgeChatResponse;
  } catch {
    // response wasn't JSON
  }

  if (!res.ok) {
    const msg = data?.error ?? `AI service request failed (${res.status}).`;
    if (res.status === 503) {
      throw new Error('AI service is not configured. Ask an admin to set the Gemini API key.');
    }
    throw new Error(msg);
  }

  if (!data || typeof data.text !== 'string') {
    throw new Error('AI service returned an unexpected response.');
  }
  return data.text;
}

export function createGeminiSession(
  seedMessages: ChatMessage[] = [],
  context?: FarmAIContext | null,
  preferredLanguage?: string,
): GeminiSession {
  const history = seedMessages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', text: m.text }));

  return {
    sendMessage: async (text: string): Promise<string> => {
      try {
        return await callEdgeFunction({
          action: 'chat',
          message: text,
          history,
          farmerMemoryContext: context?.farmerMemoryContext ?? undefined,
          weatherContext: context?.weatherContext ?? undefined,
          alertsContext: context?.alertsContext ?? undefined,
          expensesContext: context?.expensesContext ?? undefined,
          yieldContext: context?.yieldContext ?? undefined,
          marketContext: context?.marketContext ?? undefined,
          preferredLanguage,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        if (msg.includes('API_KEY') || msg.includes('401')) {
          throw new Error('Invalid Gemini API key. Contact an admin to check the GEMINI_API_KEY secret.');
        }
        if (msg.includes('429') || msg.includes('quota')) {
          throw new Error('Gemini rate limit reached. Please wait a moment and try again.');
        }
        throw new Error(`Gemini error: ${msg}`);
      }
    },
  };
}

export async function askGeminiWithImage(prompt: string, imageDataUri: string): Promise<string> {
  return callEdgeFunction({
    action: 'scan',
    scanPrompt: prompt,
    imageDataUri,
  });
}

export async function askGemini(
  prompt: string,
  context?: FarmAIContext | null,
  preferredLanguage?: string,
): Promise<string> {
  const session = createGeminiSession([], context, preferredLanguage);
  return session.sendMessage(prompt);
}

export const isGeminiConfigured = true;
