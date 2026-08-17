/**
 * geminiService.ts
 * ─────────────────────────────────────────────────────────────
 * Wraps @google/genai for the Puthumai Uzhavan AI Assistant.
 *
 * v2.0 additions:
 *  • Accepts farmerMemoryContext to inject persistent farm profile
 *  • Language-aware system instruction
 *  • Better error handling (no white screen)
 * ─────────────────────────────────────────────────────────────
 */

import { GoogleGenAI, createPartFromBase64, PartMediaResolutionLevel, type Chat } from '@google/genai';
import type { ChatMessage } from '@/data/dummyData';

const MODEL = 'gemini-2.0-flash';

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

function getApiKey(): string | null {
  return import.meta.env.VITE_GEMINI_API_KEY ?? null;
}

export function createGeminiSession(
  seedMessages: ChatMessage[] = [],
  farmerMemoryContext?: string,
  preferredLanguage?: string,
): GeminiSession {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      sendMessage: async () =>
        '⚠️ Gemini API key not configured.\n\nTo enable the AI assistant:\n1. Get a free key from https://aistudio.google.com\n2. Add VITE_GEMINI_API_KEY=your_key to your .env file\n3. Restart the dev server.\n\nUntil then I cannot answer questions.',
    };
  }

  const history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  let i = 0;
  while (i < seedMessages.length) {
    const msg = seedMessages[i];
    if (msg.role === 'user') {
      const userTurn = { role: 'user' as const, parts: [{ text: msg.text }] };
      const next = seedMessages[i + 1];
      if (next?.role === 'assistant') {
        history.push(userTurn);
        history.push({ role: 'model', parts: [{ text: next.text }] });
        i += 2;
      } else {
        history.push(userTurn);
        i += 1;
      }
    } else {
      i += 1;
    }
  }

  const ai = new GoogleGenAI({ apiKey });
  let chat: Chat | null = null;
  const systemInstruction = buildSystemInstruction(farmerMemoryContext, preferredLanguage);

  const getChat = (): Chat => {
    if (!chat) {
      chat = ai.chats.create({
        model: MODEL,
        config: { systemInstruction },
        history,
      });
    }
    return chat;
  };

  return {
    sendMessage: async (text: string): Promise<string> => {
      try {
        const response = await getChat().sendMessage({ message: text });
        return response.text ?? '(No response from Gemini)';
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        if (msg.includes('API_KEY') || msg.includes('401'))
          throw new Error('Invalid Gemini API key. Check VITE_GEMINI_API_KEY in your .env file.');
        if (msg.includes('429') || msg.includes('quota'))
          throw new Error('Gemini rate limit reached. Please wait a moment and try again.');
        throw new Error(`Gemini error: ${msg}`);
      }
    },
  };
}

function getMimeTypeFromDataUri(dataUri: string): string {
  const match = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
  return match ? match[1] : 'image/png';
}

function getDataFromDataUri(dataUri: string): string {
  const commaIndex = dataUri.indexOf(',');
  return commaIndex >= 0 ? dataUri.slice(commaIndex + 1) : dataUri;
}

export async function askGeminiWithImage(prompt: string, imageDataUri: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env.');
  }
  const ai = new GoogleGenAI({ apiKey });
  const chat = ai.chats.create({ model: MODEL, config: { systemInstruction: SYSTEM_INSTRUCTION_BASE } });
  const mimeType = getMimeTypeFromDataUri(imageDataUri);
  const base64Data = getDataFromDataUri(imageDataUri);
  const imagePart = createPartFromBase64(base64Data, mimeType, PartMediaResolutionLevel.MEDIA_RESOLUTION_MEDIUM);
  const response = await chat.sendMessage({ message: [imagePart, prompt] });
  return response.text ?? '(No response from Gemini)';
}

export async function askGemini(prompt: string, farmerMemoryContext?: string, preferredLanguage?: string): Promise<string> {
  const session = createGeminiSession([], farmerMemoryContext, preferredLanguage);
  return session.sendMessage(prompt);
}
