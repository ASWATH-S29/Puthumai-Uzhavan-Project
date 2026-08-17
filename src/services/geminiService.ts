/**
 * geminiService.ts
 * ─────────────────────────────────────────────────────────────
 * Wraps calls to the Supabase Edge Function `ai-chat` so the
 * Gemini API key never reaches the browser.
 * ─────────────────────────────────────────────────────────────
 */

import type { ChatMessage } from '@/data/dummyData';

const SYSTEM_INSTRUCTION_BASE = `You are Uzhavan AI, a friendly and knowledgeable agricultural assistant for Indian farmers, specialised in Tamil Nadu farming.

Your expertise covers:
- Crop cultivation: paddy, sugarcane, banana, tomato, groundnut, maize, black gram, cotton, millets
- Tamil Nadu agri seasons: Kharif (Jun–Sep), Rabi (Oct–Jan), Zaid (Feb–May)
- Soil types: red soil, black soil, alluvial, laterite
- Irrigation: drip, sprinkler, flood; canal networks; bore wells
- Pests & diseases: early blight, blast, fall armyworm, stem borer, red rot, powdery mildew
- Fertilizers: urea, DAP, MOP, micronutrients; organic inputs; bio-fertilisers
- Government schemes: PM-KISAN, PMFBY, Soil Health Card, TNAU services, Fasal Bima Yojana, eNAM
- Market prices, mandi rates, FPOs, NAFED
- Weather-based advisories

Communication style:
- Warm, respectful, practical — speak like a trusted agri-officer
- Give specific, actionable advice (exact dosages, timings, field names when provided)
- Use local context: Tamil Nadu districts, TNAU recommendations, state schemes
- Keep answers concise but complete; use bullet points for multi-step advice
- When the farmer's profile is provided, reference it directly and tailor every answer
- Respond in the farmer's preferred language when specified; Tamil is strongly preferred
- Mix Tamil terms naturally when appropriate (e.g. "நெல் சாகுபடி", "களை நிர்வாகம்")

Safety: Never recommend banned pesticides. Always suggest consulting a local Krishi Vigyan Kendra (KVK) for complex cases.`;

function buildSystemInstruction(farmerMemoryContext?: string, preferredLanguage?: string): string {
  let instruction = SYSTEM_INSTRUCTION_BASE;
  if (farmerMemoryContext && farmerMemoryContext.trim()) {
    instruction += `\n\n${farmerMemoryContext.trim()}`;
  }
  if (preferredLanguage && preferredLanguage !== 'en') {
    const langNames: Record<string, string> = {
      ta: 'Tamil (தமிழ்)',
      hi: 'Hindi (हिंदी)',
      te: 'Telugu (తెలుగు)',
      ml: 'Malayalam (മലയാളം)',
      kn: 'Kannada (ಕನ್ನಡ)',
    };
    const langName = langNames[preferredLanguage] ?? preferredLanguage;
    instruction += `\n\nIMPORTANT: This farmer prefers ${langName}. Respond primarily in ${langName} and mix in simple English only for technical terms and scheme names.`;
  }
  return instruction;
}

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
  farmerMemoryContext?: string,
  preferredLanguage?: string,
): GeminiSession {
  const systemInstruction = buildSystemInstruction(farmerMemoryContext, preferredLanguage);

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
          farmerMemoryContext: systemInstruction,
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

export async function askGemini(prompt: string, farmerMemoryContext?: string, preferredLanguage?: string): Promise<string> {
  const session = createGeminiSession([], farmerMemoryContext, preferredLanguage);
  return session.sendMessage(prompt);
}

// Kept for backward compatibility — no longer used to gate mock mode.
export const isGeminiConfigured = true;
