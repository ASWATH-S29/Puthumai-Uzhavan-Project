/**
 * FarmingAlertsPage.tsx  v2.0
 * Feature 6: Smart Farming Alerts
 * Shows AI-generated reminders + ability to view/dismiss alerts.
 */

import { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2, Check, Sprout, Cloud, Droplets, Landmark, Brain, AlertTriangle, type LucideIcon } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import {
  getAlerts,
  markAlertRead,
  createAlert,
  generateSmartReminders,
  type FarmerAlert,
} from '@/services/farmerAlertsService';
import { getFarmerMemory } from '@/services/farmerMemoryService';

const ICON_MAP: Record<string, LucideIcon> = {
  weather:    Cloud,
  crop:       Sprout,
  irrigation: Droplets,
  scheme:     Landmark,
  reminder:   Bell,
  health:     AlertTriangle,
  ai:         Brain,
};

const SEVERITY_STYLES: Record<string, string> = {
  info:     'bg-brand-50 border-brand-100 text-brand-700',
  warning:  'bg-amber-50 border-amber-100 text-amber-700',
  critical: 'bg-red-50 border-red-100 text-red-700',
};

const SEVERITY_DOT: Record<string, string> = {
  info:     'bg-brand-500',
  warning:  'bg-amber-500',
  critical: 'bg-red-500',
};

export default function FarmingAlertsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts]       = useState<FarmerAlert[]>([]);
  const [loading, setLoading]     = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter]       = useState<'all' | 'unread'>('all');

  const load = async () => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    const data = await getAlerts(user.id);
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => { void load(); }, [user?.id]);

  const generateReminders = async () => {
    if (!user?.id) return;
    setGenerating(true);
    try {
      const mem = await getFarmerMemory(user.id);
      const reminders = generateSmartReminders(mem);
      for (const r of reminders) {
        await createAlert(user.id, r);
      }
      toast(`${reminders.length} smart reminders generated`, 'success');
      await load();
    } catch {
      toast('Failed to generate reminders', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const dismiss = async (alertId: string) => {
    await markAlertRead(alertId);
    setAlerts((prev) => prev.map((a) => a.id === alertId ? { ...a, is_read: true } : a));
  };

  const dismissAll = async () => {
    const unread = alerts.filter((a) => !a.is_read);
    for (const a of unread) await markAlertRead(a.id);
    setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
    toast('All alerts marked as read', 'success');
  };

  const visible = filter === 'unread' ? alerts.filter((a) => !a.is_read) : alerts;
  const unreadCount = alerts.filter((a) => !a.is_read).length;

  if (!user) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center text-amber-700">
        Please log in to view alerts.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader icon={Bell} title="Smart Farming Alerts"
        subtitle="Crop reminders, irrigation prompts, scheme updates, and AI recommendations." />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                filter === f ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-ink-700 hover:border-brand-300'}`}>
              {f === 'all' ? `All (${alerts.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={dismissAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 hover:border-brand-300 transition-colors">
              <Check size={14} /> Mark all read
            </button>
          )}
          <button onClick={generateReminders} disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 text-white px-4 py-2 text-sm font-bold hover:bg-brand-700 transition-colors disabled:opacity-60">
            {generating ? <><Loader2 size={14} className="animate-spin" /> Generating…</> : <><Brain size={14} /> Generate Smart Reminders</>}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-brand-600" /></div>
      ) : visible.length === 0 ? (
        <GlassCard padding="lg">
          <div className="text-center py-10">
            <div className="mx-auto h-16 w-16 rounded-xl bg-brand-50 grid place-items-center mb-3">
              <BellOff size={28} className="text-brand-400" />
            </div>
            <div className="font-display font-bold text-ink-900">No alerts yet</div>
            <p className="text-sm text-ink-600 mt-1">
              Click <strong>Generate Smart Reminders</strong> to create farm-specific alerts based on your crop profile.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {visible.map((alert) => {
            const IconComp = ICON_MAP[alert.alert_type] ?? Bell;
            const styleClass = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info;
            const dotClass = SEVERITY_DOT[alert.severity] ?? SEVERITY_DOT.info;
            return (
              <div key={alert.id}
                className={`rounded-2xl border p-4 transition-opacity ${styleClass} ${alert.is_read ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="relative">
                      <IconComp size={20} className="inline-block" />
                      {!alert.is_read && (
                        <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${dotClass}`} />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{alert.title}</span>
                      {!alert.is_live && (
                        <span className="text-[10px] bg-white/60 rounded-md px-1.5 py-0.5 font-medium">Reminder</span>
                      )}
                      {alert.is_live && (
                        <span className="text-[10px] bg-white/60 rounded-md px-1.5 py-0.5 font-medium text-green-700">Live</span>
                      )}
                    </div>
                    {alert.detail && <p className="text-xs mt-1 opacity-90">{alert.detail}</p>}
                    <div className="text-[10px] mt-1 opacity-60">
                      {new Date(alert.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                  {!alert.is_read && (
                    <button onClick={() => dismiss(alert.id)}
                      className="flex-shrink-0 h-7 w-7 rounded-lg bg-white/60 grid place-items-center hover:bg-white transition-colors"
                      title="Mark as read">
                      <Check size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-[11px] text-ink-400 text-center pb-2">
        Reminders are AI-generated based on your farm profile. Live weather/crop alerts require a connected data source.
      </div>
    </div>
  );
}
