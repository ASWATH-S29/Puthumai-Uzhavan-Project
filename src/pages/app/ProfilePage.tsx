import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Camera, Loader2, Save, MapPin, Phone, Languages, Maximize } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';

const states = [
  'Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana',
  'Maharashtra', 'Gujarat', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Other',
];

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? '',
        phone: profile.phone ?? '',
        village: profile.village ?? '',
        district: profile.district ?? '',
        state: profile.state ?? '',
        farm_size: profile.farm_size ?? 0,
        preferred_language: profile.preferred_language ?? 'en',
      });
    }
  }, [profile]);

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [key]: key === 'farm_size' ? Number(v) : v }));

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast('Image must be under 2 MB', 'error');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      const { error: dbErr } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user.id);
      if (dbErr) throw dbErr;
      await refreshProfile();
      toast('Profile picture updated', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        phone: form.phone,
        village: form.village,
        district: form.district,
        state: form.state,
        farm_size: form.farm_size,
        preferred_language: form.preferred_language,
      })
      .eq('id', user.id);
    setSaving(false);
    if (error) {
      toast(error.message, 'error');
      return;
    }
    await refreshProfile();
    toast('Profile saved successfully', 'success');
  };

  const displayName = form.full_name || user?.email?.split('@')[0] || 'Farmer';
  const initials = displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const avatarUrl = profile?.avatar_url;

  return (
    <div className="space-y-6">
      <PageHeader icon={UserCircle} title="Profile" subtitle="Manage your personal and farm information." />

      {/* avatar + identity */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard padding="lg" className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="h-24 w-24 rounded-xl object-cover shadow-card" />
            ) : (
              <div className="h-24 w-24 rounded-xl bg-brand-600 grid place-items-center text-white font-display font-extrabold text-3xl shadow-card">
                {initials}
              </div>
            )}
            <label className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-white border border-brand-200 shadow-card grid place-items-center cursor-pointer hover:bg-brand-50 transition-colors">
              {uploading ? <Loader2 size={16} className="animate-spin text-brand-600" /> : <Camera size={16} className="text-brand-600" />}
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
            </label>
          </div>
          <div className="flex-1">
            <div className="font-display font-extrabold text-2xl text-ink-900">{displayName}</div>
            <div className="text-sm text-ink-800/55 mt-0.5">{user?.email}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg bg-brand-100 text-brand-700 px-2.5 py-1 text-[11px] font-bold">
                {form.state || 'Location not set'}
              </span>
              <span className="rounded-lg bg-accent-50 text-accent-700 px-2.5 py-1 text-[11px] font-bold">
                {form.farm_size ? `${form.farm_size} acres` : 'No farm size'}
              </span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* edit form */}
      <form onSubmit={onSave}>
        <GlassCard padding="lg">
          <div className="font-display font-bold text-ink-900">Edit Details</div>
          <div className="text-xs text-ink-600 mt-0.5">Update your information anytime.</div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <FormField label="Full Name" name="full_name" value={form.full_name ?? ''} onChange={set('full_name')} placeholder="Your name" icon={<UserCircle size={15} />} />
            <FormField label="Phone" name="phone" value={form.phone ?? ''} onChange={set('phone')} placeholder="+91 98765 43210" icon={<Phone size={15} />} />
            <FormField label="Village" name="village" value={form.village ?? ''} onChange={set('village')} placeholder="e.g. Papanasam" icon={<MapPin size={15} />} />
            <FormField label="District" name="district" value={form.district ?? ''} onChange={set('district')} placeholder="e.g. Thanjavur" />
            <FormField label="State" name="state" variant="select" value={form.state ?? ''} onChange={set('state')} options={states} />
            <FormField label="Farm Size (acres)" name="farm_size" type="number" value={String(form.farm_size ?? 0)} onChange={set('farm_size')} placeholder="0.0" icon={<Maximize size={15} />} />
            <FormField
              label="Preferred Language"
              name="preferred_language"
              variant="select"
              value={form.preferred_language ?? 'en'}
              onChange={set('preferred_language')}
              options={['en', 'ta']}
              icon={<Languages size={15} />}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save changes</>}
            </Button>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}
