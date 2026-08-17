/**
 * farmerMemoryService.ts
 * ─────────────────────────────────────────────────────────────
 * Persistent farmer memory stored in Supabase farmer_memory table.
 * RLS ensures each farmer can only access their own data.
 * ─────────────────────────────────────────────────────────────
 */

import { supabase } from '@/lib/supabase';

export interface FarmerMemory {
  id?: string;
  user_id?: string;
  farmer_name?: string | null;
  village?: string | null;
  district?: string | null;
  state?: string | null;
  farm_size_acres?: number | null;
  soil_type?: string | null;
  irrigation_method?: string | null;
  current_crop?: string | null;
  crop_variety?: string | null;
  crop_stage?: string | null;
  planting_date?: string | null;
  expected_harvest?: string | null;
  previous_crop?: string | null;
  previous_yield_kg?: number | null;
  preferred_language?: string | null;
  farming_category?: string | null;
  extra_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Fetch this farmer's memory record (returns null if not yet saved) */
export async function getFarmerMemory(userId: string): Promise<FarmerMemory | null> {
  const { data, error } = await supabase
    .from('farmer_memory')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('getFarmerMemory error:', error.message);
    return null;
  }
  return data as FarmerMemory | null;
}

/** Upsert (create or update) farmer memory */
export async function saveFarmerMemory(
  userId: string,
  payload: Omit<FarmerMemory, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
): Promise<FarmerMemory | null> {
  const { data, error } = await supabase
    .from('farmer_memory')
    .upsert({ user_id: userId, ...payload }, { onConflict: 'user_id' })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('saveFarmerMemory error:', error.message);
    throw new Error(error.message);
  }
  return data as FarmerMemory | null;
}

/** Build a concise context string for injecting into the Gemini prompt */
export function buildFarmerMemoryContext(memory: FarmerMemory | null): string {
  if (!memory) return '';

  const lines: string[] = [];
  if (memory.farmer_name)      lines.push(`Farmer: ${memory.farmer_name}`);
  if (memory.village)          lines.push(`Village: ${memory.village}`);
  if (memory.district)         lines.push(`District: ${memory.district}`);
  if (memory.state)            lines.push(`State: ${memory.state}`);
  if (memory.farm_size_acres)  lines.push(`Farm size: ${memory.farm_size_acres} acres`);
  if (memory.farming_category) lines.push(`Farm category: ${memory.farming_category}`);
  if (memory.soil_type)        lines.push(`Soil type: ${memory.soil_type}`);
  if (memory.irrigation_method) lines.push(`Irrigation: ${memory.irrigation_method}`);
  if (memory.current_crop)     lines.push(`Current crop: ${memory.current_crop}${memory.crop_variety ? ` (${memory.crop_variety})` : ''}`);
  if (memory.crop_stage)       lines.push(`Crop stage: ${memory.crop_stage}`);
  if (memory.planting_date)    lines.push(`Planted on: ${memory.planting_date}`);
  if (memory.expected_harvest) lines.push(`Expected harvest: ${memory.expected_harvest}`);
  if (memory.previous_crop)    lines.push(`Previous crop: ${memory.previous_crop}`);
  if (memory.previous_yield_kg) lines.push(`Previous yield: ${memory.previous_yield_kg} kg`);
  if (memory.extra_notes)      lines.push(`Farm notes: ${memory.extra_notes}`);

  if (lines.length === 0) return '';
  return `[Farmer Farm Profile]\n${lines.join('\n')}\n`;
}

/** Compute profile completeness (0–100) */
export interface ProfileCompletenessResult {
  score: number;          // 0–100
  missing: string[];      // human-readable list of missing fields
}

const COMPLETENESS_FIELDS: { key: keyof FarmerMemory; label: string }[] = [
  { key: 'farmer_name',       label: 'Farmer Name' },
  { key: 'village',           label: 'Village' },
  { key: 'district',          label: 'District' },
  { key: 'farm_size_acres',   label: 'Farm Size' },
  { key: 'soil_type',         label: 'Soil Type' },
  { key: 'irrigation_method', label: 'Irrigation Method' },
  { key: 'current_crop',      label: 'Current Crop' },
  { key: 'crop_stage',        label: 'Crop Stage' },
  { key: 'previous_crop',     label: 'Previous Crop' },
  { key: 'farming_category',  label: 'Farm Category' },
];

export function computeProfileCompleteness(memory: FarmerMemory | null): ProfileCompletenessResult {
  if (!memory) return { score: 0, missing: COMPLETENESS_FIELDS.map((f) => f.label) };

  const missing: string[] = [];
  let filled = 0;

  for (const { key, label } of COMPLETENESS_FIELDS) {
    const val = memory[key];
    if (val === null || val === undefined || val === '') {
      missing.push(label);
    } else {
      filled++;
    }
  }

  const score = Math.round((filled / COMPLETENESS_FIELDS.length) * 100);
  return { score, missing };
}
