import { supabase } from '@/lib/supabase';
import type { FarmRecord, FarmCreatePayload, FarmUpdatePayload } from '@/services/types';

const FARM_TABLE = 'farms';

function normalizeFarm(farm: Partial<FarmRecord> & Record<string, unknown>): FarmRecord {
  return {
    id: String(farm.id ?? ''),
    owner_id: farm.owner_id ? String(farm.owner_id) : undefined,
    name: String(farm.name ?? 'Unnamed farm'),
    location: String(farm.location ?? 'Not provided'),
    crop: String(farm.crop ?? 'Mixed crops'),
    area: Number(farm.area ?? 0),
    health: Number(farm.health ?? 0),
    status: String(farm.status ?? 'Active'),
    description: farm.description ? String(farm.description) : undefined,
    soil_type: farm.soil_type ? String(farm.soil_type) : undefined,
    village: farm.village ? String(farm.village) : undefined,
    district: farm.district ? String(farm.district) : undefined,
    irrigation_type: farm.irrigation_type ? String(farm.irrigation_type) : undefined,
    notes: farm.notes ? String(farm.notes) : undefined,
    created_at: farm.created_at ? String(farm.created_at) : undefined,
    updated_at: farm.updated_at ? String(farm.updated_at) : undefined,
  };
}

export async function getFarms(ownerId?: string | null): Promise<FarmRecord[]> {
  let query = supabase.from(FARM_TABLE).select('*').order('created_at', { ascending: false });

  if (ownerId) {
    query = query.eq('owner_id', ownerId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((farm) => normalizeFarm(farm as Partial<FarmRecord>));
}

export async function createFarm(payload: FarmCreatePayload): Promise<FarmRecord> {
  const { data, error } = await supabase
    .from(FARM_TABLE)
    .insert({
      owner_id: payload.owner_id,
      name: payload.name,
      location: payload.location,
      crop: payload.crop,
      area: payload.area,
      health: payload.health,
      status: payload.status,
      description: payload.description,
      soil_type: payload.soil_type,
      village: payload.village,
      district: payload.district,
      irrigation_type: payload.irrigation_type,
      notes: payload.notes,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeFarm(data as Partial<FarmRecord>);
}

export async function updateFarm(id: string, payload: FarmUpdatePayload): Promise<FarmRecord> {
  const { data, error } = await supabase
    .from(FARM_TABLE)
    .update({
      name: payload.name,
      location: payload.location,
      crop: payload.crop,
      area: payload.area,
      health: payload.health,
      status: payload.status,
      description: payload.description,
      soil_type: payload.soil_type,
      village: payload.village,
      district: payload.district,
      irrigation_type: payload.irrigation_type,
      notes: payload.notes,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeFarm(data as Partial<FarmRecord>);
}

export async function deleteFarm(id: string): Promise<void> {
  const { error } = await supabase.from(FARM_TABLE).delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
}
