import { supabase } from '@/lib/supabase';
import { mockScanner } from '@/services/mockData';
import { askGeminiWithImage } from '@/services/geminiService';
import type { ScannerRequest, ScannerResponse, ScanResult, CropScanHistoryRow } from '@/services/types';

const MOCK_DELAY = 1500;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

function parseJsonFromGemini(responseText: string): string {
  const jsonBlockMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/i);
  const candidate = jsonBlockMatch ? jsonBlockMatch[1] : responseText;
  const objectMatch = candidate.match(/\{[\s\S]*\}/);
  if (!objectMatch) {
    throw new Error('Gemini response did not include valid JSON.');
  }
  return objectMatch[0];
}

function normalizeSeverity(value: unknown): ScanResult['severity'] {
  const severity = String(value ?? '').trim().toLowerCase();
  if (severity === 'high') return 'High';
  if (severity === 'moderate') return 'Moderate';
  if (severity === 'low') return 'Low';
  return 'None';
}

function normalizeStatus(disease: string | null, severity: ScanResult['severity']): ScanResult['status'] {
  if (disease) return 'Action needed';
  return severity === 'None' ? 'Healthy' : 'Action needed';
}

function parseGeminiScanResponse(responseText: string, crop: string, field: string): ScannerResponse {
  const jsonText = parseJsonFromGemini(responseText);
  const parsed = JSON.parse(jsonText) as Record<string, unknown>;

  const disease = parsed.disease === null ? null : String(parsed.disease ?? '').trim() || null;
  const diseaseConfidence = Number(parsed.disease_confidence ?? parsed.diseaseConfidence ?? 0);
  const nutrientDeficiency = String(parsed.nutrient_deficiency ?? parsed.nutrientDeficiency ?? 'None').trim();
  const nutrientConfidence = Number(parsed.nutrient_confidence ?? parsed.nutrientConfidence ?? 0);
  const waterStress = String(parsed.water_stress ?? parsed.waterStress ?? 'None').trim();
  const waterConfidence = Number(parsed.water_confidence ?? parsed.waterConfidence ?? 0);
  const pestRisk = String(parsed.pest_risk ?? parsed.pestRisk ?? 'None').trim();
  const pestConfidence = Number(parsed.pest_confidence ?? parsed.pestConfidence ?? 0);
  const recommendation = String(parsed.recommendation ?? parsed.treatment ?? 'Review the field and consult an agronomist.').trim();
  const overallConfidence = Number(parsed.overall_confidence ?? parsed.overallConfidence ?? parsed.confidence ?? 0);
  const severity = normalizeSeverity(parsed.severity ?? (disease ? 'Moderate' : 'None'));
  const status = normalizeStatus(disease, severity);

  const result: ScanResult = {
    crop,
    field,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    disease,
    confidence: Math.round(Math.min(100, Math.max(0, overallConfidence || diseaseConfidence || 0))),
    severity,
    treatment: recommendation,
    status,
  };

  return {
    result,
    analysis: {
      disease,
      diseaseConfidence: Math.round(Math.min(100, Math.max(0, diseaseConfidence || overallConfidence || 0))),
      nutrientDeficiency,
      nutrientConfidence: Math.round(Math.min(100, Math.max(0, nutrientConfidence))),
      waterStress: ['None', 'Low', 'Moderate', 'High'].includes(waterStress) ? (waterStress as ScanResult['severity']) : 'None',
      waterConfidence: Math.round(Math.min(100, Math.max(0, waterConfidence))),
      pestRisk: ['None', 'Low', 'Moderate', 'High'].includes(pestRisk) ? (pestRisk as ScanResult['severity']) : 'None',
      pestConfidence: Math.round(Math.min(100, Math.max(0, pestConfidence))),
      recommendation,
      overallConfidence: Math.round(Math.min(100, Math.max(0, overallConfidence || diseaseConfidence || 0))),
    },
  };
}

function buildScanPrompt(crop: string, field: string) {
  return `Analyze the attached leaf image from a ${crop} field named "${field}". Provide only valid JSON with exactly these keys:\n` +
    `{
` +
    `  "disease": string | null,
` +
    `  "disease_confidence": number,
` +
    `  "nutrient_deficiency": string,
` +
    `  "nutrient_confidence": number,
` +
    `  "water_stress": "None" | "Low" | "Moderate" | "High",
` +
    `  "water_confidence": number,
` +
    `  "pest_risk": "None" | "Low" | "Moderate" | "High",
` +
    `  "pest_confidence": number,
` +
    `  "recommendation": string,
` +
    `  "overall_confidence": number,
` +
    `  "severity": "None" | "Low" | "Moderate" | "High"
` +
    `}\n` +
    `If there is no disease, set "disease" to null and "severity" to \"None\". Do not include any extra text outside the JSON object.`;
}

export async function scanCrop(payload: ScannerRequest): Promise<ScannerResponse> {
  if (USE_MOCK || !GEMINI_KEY) {
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockScanner(payload.crop, payload.field);
  }

  try {
    const responseText = await askGeminiWithImage(buildScanPrompt(payload.crop, payload.field), payload.imageData);
    return parseGeminiScanResponse(responseText, payload.crop, payload.field);
  } catch (err) {
    console.warn('Crop scan failed, using fallback mock response.', err);
    await new Promise((r) => setTimeout(r, MOCK_DELAY));
    return mockScanner(payload.crop, payload.field);
  }
}

export async function saveCropScanHistory(userId: string, scan: ScanResult): Promise<void> {
  const { error } = await supabase.from('crop_scans').insert({
    user_id: userId,
    crop: scan.crop,
    field: scan.field,
    disease: scan.disease,
    confidence: scan.confidence,
    severity: scan.severity,
    treatment: scan.treatment,
    status: scan.status,
    date: scan.date,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCropScanHistory(userId: string): Promise<CropScanHistoryRow[]> {
  const { data, error } = await supabase
    .from('crop_scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: String((row as Partial<CropScanHistoryRow> & Record<string, unknown>).id ?? ''),
    user_id: String((row as Partial<CropScanHistoryRow> & Record<string, unknown>).user_id ?? ''),
    crop: String((row as Record<string, unknown>).crop ?? 'Unknown'),
    field: String((row as Record<string, unknown>).field ?? 'Field'),
    date: String((row as Record<string, unknown>).date ?? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })),
    disease: (row as Record<string, unknown>).disease === null ? null : String((row as Record<string, unknown>).disease ?? 'None'),
    confidence: Number((row as Record<string, unknown>).confidence ?? 0),
    severity: normalizeSeverity((row as Record<string, unknown>).severity ?? 'None'),
    treatment: String((row as Record<string, unknown>).treatment ?? 'No recommendation available.'),
    status: String((row as Record<string, unknown>).status ?? 'Healthy') as ScanResult['status'],
    created_at: (row as Record<string, unknown>).created_at ? String((row as Record<string, unknown>).created_at) : undefined,
  }));
}
