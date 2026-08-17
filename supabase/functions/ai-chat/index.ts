import { GoogleGenAI, createPartFromBase64, PartMediaResolutionLevel } from 'npm:@google/genai@2.16.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

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

interface ChatMessagePayload {
  text: string;
  role: 'user' | 'assistant';
}

interface RequestBody {
  action: 'chat' | 'scan';
  message?: string;
  history?: ChatMessagePayload[];
  imageDataUri?: string;
  farmerMemoryContext?: string;
  preferredLanguage?: string;
  scanPrompt?: string;
}

function getMimeTypeFromDataUri(dataUri: string): string {
  const match = dataUri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
  return match ? match[1] : 'image/png';
}

function getDataFromDataUri(dataUri: string): string {
  const commaIndex = dataUri.indexOf(',');
  return commaIndex >= 0 ? dataUri.slice(commaIndex + 1) : dataUri;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'AI service is not configured. Set the GEMINI_API_KEY secret.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const body = (await req.json()) as RequestBody;
    const ai = new GoogleGenAI({ apiKey });

    if (body.action === 'scan') {
      if (!body.imageDataUri || !body.scanPrompt) {
        return new Response(
          JSON.stringify({ error: 'Image data and scan prompt are required for scan action.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const systemInstruction = buildSystemInstruction(body.farmerMemoryContext, body.preferredLanguage);
      const chat = ai.chats.create({ model: MODEL, config: { systemInstruction } });
      const mimeType = getMimeTypeFromDataUri(body.imageDataUri);
      const base64Data = getDataFromDataUri(body.imageDataUri);
      const imagePart = createPartFromBase64(base64Data, mimeType, PartMediaResolutionLevel.MEDIA_RESOLUTION_MEDIUM);
      const response = await chat.sendMessage({ message: [imagePart, body.scanPrompt] });
      return new Response(
        JSON.stringify({ text: response.text ?? '(No response from Gemini)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Default: chat action
    if (!body.message) {
      return new Response(
        JSON.stringify({ error: 'Message is required for chat action.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const systemInstruction = buildSystemInstruction(body.farmerMemoryContext, body.preferredLanguage);
    const history = (body.history ?? [])
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
        parts: [{ text: m.text }],
      }));

    const chat = ai.chats.create({
      model: MODEL,
      config: { systemInstruction },
      history,
    });

    const response = await chat.sendMessage({ message: body.message });
    return new Response(
      JSON.stringify({ text: response.text ?? '(No response from Gemini)' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    let friendly = `AI service error: ${message}`;
    if (message.includes('API_KEY') || message.includes('401')) {
      friendly = 'AI service authentication failed. The Gemini API key may be invalid.';
    } else if (message.includes('429') || message.includes('quota')) {
      friendly = 'AI service rate limit reached. Please wait a moment and try again.';
    }
    return new Response(
      JSON.stringify({ error: friendly }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
