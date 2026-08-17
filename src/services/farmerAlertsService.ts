/**
 * farmerAlertsService.ts
 * Smart farming alerts stored in Supabase farmer_alerts table.
 */

import { supabase } from '@/lib/supabase';
import type { FarmerMemory } from './farmerMemoryService';

export interface FarmerAlert {
  id: string;
  user_id: string;
  title: string;
  detail?: string | null;
  alert_type: 'weather' | 'crop' | 'irrigation' | 'scheme' | 'reminder' | 'health' | 'ai';
  severity: 'info' | 'warning' | 'critical';
  is_read: boolean;
  is_live: boolean;
  created_at: string;
}

export async function getAlerts(userId: string): Promise<FarmerAlert[]> {
  const { data, error } = await supabase
    .from('farmer_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('getAlerts error:', error.message);
    return [];
  }
  return (data ?? []) as FarmerAlert[];
}

export async function markAlertRead(alertId: string): Promise<void> {
  await supabase
    .from('farmer_alerts')
    .update({ is_read: true })
    .eq('id', alertId);
}

export async function createAlert(
  userId: string,
  alert: Omit<FarmerAlert, 'id' | 'user_id' | 'created_at' | 'is_read'>,
): Promise<void> {
  const { error } = await supabase
    .from('farmer_alerts')
    .insert({ user_id: userId, is_read: false, ...alert });
  if (error) console.error('createAlert error:', error.message);
}

/**
 * Generate smart reminders based on farmer memory.
 * These are static/AI-derived reminders, NOT live data.
 * is_live = false so UI can clearly distinguish them.
 */
export function generateSmartReminders(memory: FarmerMemory | null): Omit<FarmerAlert, 'id' | 'user_id' | 'created_at' | 'is_read'>[] {
  if (!memory) return [];

  const reminders: Omit<FarmerAlert, 'id' | 'user_id' | 'created_at' | 'is_read'>[] = [];

  // Crop stage reminders
  if (memory.current_crop && memory.crop_stage) {
    const crop = memory.current_crop;
    const stage = memory.crop_stage.toLowerCase();

    if (stage === 'sowing') {
      reminders.push({
        title: `${crop} – Sowing Stage Tips`,
        detail: 'Ensure proper seed treatment and correct seed rate. Verify soil moisture before sowing.',
        alert_type: 'crop',
        severity: 'info',
        is_live: false,
      });
    }
    if (stage === 'vegetative') {
      reminders.push({
        title: `${crop} – Vegetative Stage`,
        detail: 'Check for pest incidence. Apply recommended N fertilizer split dose.',
        alert_type: 'crop',
        severity: 'info',
        is_live: false,
      });
      reminders.push({
        title: 'Irrigation Reminder',
        detail: `Maintain adequate soil moisture for ${crop} in vegetative stage.`,
        alert_type: 'irrigation',
        severity: 'info',
        is_live: false,
      });
    }
    if (stage === 'flowering') {
      reminders.push({
        title: `${crop} – Critical Flowering Stage`,
        detail: 'Avoid moisture stress. Do not apply fungicides during peak flowering hours.',
        alert_type: 'crop',
        severity: 'warning',
        is_live: false,
      });
    }
    if (stage === 'harvesting') {
      reminders.push({
        title: `${crop} – Harvest Approaching`,
        detail: 'Arrange labor and transport. Check moisture content before cutting.',
        alert_type: 'crop',
        severity: 'info',
        is_live: false,
      });
    }
  }

  // Irrigation reminder based on method
  if (memory.irrigation_method === 'drip') {
    reminders.push({
      title: 'Drip System Check',
      detail: 'Inspect drip laterals and emitters for blockages. Flush mainline weekly.',
      alert_type: 'irrigation',
      severity: 'info',
      is_live: false,
    });
  }

  // Soil health reminder
  if (!memory.soil_type) {
    reminders.push({
      title: 'Soil Health Card',
      detail: 'Apply for a free Soil Health Card at your nearest agricultural office for soil nutrient analysis.',
      alert_type: 'scheme',
      severity: 'info',
      is_live: false,
    });
  }

  // PM-KISAN reminder
  reminders.push({
    title: 'PM-KISAN – Check Status',
    detail: 'Verify your PM-KISAN instalment status at pmkisan.gov.in. Next instalment may be due.',
    alert_type: 'scheme',
    severity: 'info',
    is_live: false,
  });

  // Profile completeness
  if (!memory.current_crop) {
    reminders.push({
      title: 'Complete Your Farm Profile',
      detail: 'Add your current crop details to get personalised AI recommendations.',
      alert_type: 'ai',
      severity: 'info',
      is_live: false,
    });
  }

  return reminders;
}
