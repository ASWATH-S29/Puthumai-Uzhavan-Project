import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon, User, LogOut, ChevronRight, Moon, Sun,
  Languages, Bell, Shield, HelpCircle, Mail, Loader2,
} from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import GlassCard from '@/components/ui/GlassCard';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { settingsGroups, type SettingItem } from '@/data/dummyData';

export default function SettingsPage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [groups, setGroups] = useState(settingsGroups);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ta'>(profile?.preferred_language ?? 'en');
  const [savingLang, setSavingLang] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggle = (groupTitle: string, label: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.title === groupTitle
          ? { ...g, items: g.items.map((it) => (it.label === label ? { ...it, on: !it.on } : it)) }
          : g,
      ),
    );
    toast(`${label} ${groups.flatMap((g) => g.items).find((it) => it.label === label)?.on ? 'disabled' : 'enabled'}`, 'info');
  };

  const handleSignOut = async () => {
    await signOut();
    toast('Signed out successfully', 'info');
    navigate('/login', { replace: true });
  };

  const saveLanguage = async () => {
    if (!user) return;
    setSavingLang(true);
    const { error } = await supabase
      .from('profiles')
      .update({ preferred_language: language })
      .eq('id', user.id);
    setSavingLang(false);
    if (error) {
      toast(error.message, 'error');
      return;
    }
    await refreshProfile();
    toast('Language preference saved', 'success');
  };

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'Farmer';

  return (
    <div className="space-y-6">
      <PageHeader icon={SettingsIcon} title="Settings" subtitle="Manage your account, preferences, and appearance." />

      {/* profile banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard padding="lg" className="flex flex-col sm:flex-row sm:items-center gap-5">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={displayName} className="h-16 w-16 rounded-xl object-cover shadow-card flex-shrink-0" />
          ) : (
            <div className="h-16 w-16 rounded-xl bg-brand-600 grid place-items-center text-white font-display font-extrabold text-2xl shadow-card flex-shrink-0">
              {displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="font-display font-extrabold text-xl text-ink-900">{displayName}</div>
            <div className="text-sm text-ink-800/55">{user?.email}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-lg bg-brand-100 text-brand-700 px-2.5 py-1 text-[11px] font-bold">
                {profile?.village ?? 'Location not set'}
              </span>
              <span className="rounded-lg bg-accent-50 text-accent-700 px-2.5 py-1 text-[11px] font-bold">
                {profile?.farm_size ? `${profile.farm_size} acres` : 'No farm size'}
              </span>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate('/dashboard/profile')}>
            <User size={16} /> Edit profile
          </Button>
        </GlassCard>
      </motion.div>

      {/* appearance + language */}
      <div className="grid lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard padding="lg">
            <div className="flex items-center gap-2 mb-4">
              {darkMode ? <Moon size={18} className="text-brand-600" /> : <Sun size={18} className="text-brand-600" />}
              <div className="font-display font-bold text-ink-900">Appearance</div>
            </div>
            <div className="flex items-center gap-3 py-3">
              <div className="h-9 w-9 rounded-xl bg-brand-50 grid place-items-center flex-shrink-0">
                {darkMode ? <Moon size={17} className="text-brand-700" /> : <Sun size={17} className="text-brand-700" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink-900">Dark Mode</div>
                <div className="text-xs text-ink-600">Switch between light and dark themes</div>
              </div>
              <button
                onClick={() => setDarkMode((d) => !d)}
                className={`relative h-6 w-11 rounded-full transition-colors ${darkMode ? 'bg-brand-600' : 'bg-ink-900/15'}`}
                aria-label="Toggle dark mode"
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${darkMode ? 'left-[22px]' : 'left-0.5'}`}
                />
              </button>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <GlassCard padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <Languages size={18} className="text-brand-600" />
              <div className="font-display font-bold text-ink-900">Language</div>
            </div>
            <div className="space-y-2">
              {[
                { code: 'en' as const, label: 'English', sub: 'Default' },
                { code: 'ta' as const, label: 'தமிழ் (Tamil)', sub: 'Native' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left transition-colors ${
                    language === lang.code ? 'bg-brand-50 border border-brand-200' : 'bg-brand-50 border border-white/50 hover:bg-brand-50'
                  }`}
                >
                  <Languages size={17} className={language === lang.code ? 'text-brand-600' : 'text-ink-600'} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink-900">{lang.label}</div>
                    <div className="text-xs text-ink-600">{lang.sub}</div>
                  </div>
                  {language === lang.code && <div className="h-4 w-4 rounded-full bg-brand-600 ring-4 ring-brand-100" />}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={saveLanguage} disabled={savingLang || language === profile?.preferred_language}>
                {savingLang ? <Loader2 size={15} className="animate-spin" /> : 'Save language'}
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* setting groups */}
      <div className="grid lg:grid-cols-2 gap-5">
        {groups.map((group, gi) => (
          <motion.div key={group.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.08 }}>
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-4">
                {group.title === 'Notifications' && <Bell size={18} className="text-brand-600" />}
                {group.title === 'Security' && <Shield size={18} className="text-brand-600" />}
                {group.title === 'Help & Support' && <HelpCircle size={18} className="text-brand-600" />}
                <div className="font-display font-bold text-ink-900">{group.title}</div>
              </div>
              <div className="divide-y divide-ink-900/5">
                {group.items.map((it) => {
                  const item: SettingItem = it;
                  return (
                    <div key={item.label} className="flex items-center gap-3 py-3">
                      <div className="h-9 w-9 rounded-xl bg-brand-50 grid place-items-center flex-shrink-0">
                        <Icon name={item.icon} size={17} className="text-brand-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink-900">{item.label}</div>
                        {!item.toggle && <div className="text-xs text-ink-600 truncate">{item.value}</div>}
                      </div>
                      {item.toggle ? (
                        <button
                          onClick={() => toggle(group.title, item.label)}
                          className={`relative h-6 w-11 rounded-full transition-colors ${item.on ? 'bg-brand-600' : 'bg-ink-900/15'}`}
                          aria-label={`Toggle ${item.label}`}
                        >
                          <motion.span
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${item.on ? 'left-[22px]' : 'left-0.5'}`}
                          />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-semibold text-ink-800/55">
                          {item.value}
                          <ChevronRight size={15} className="text-ink-800/30" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* account info */}
      <GlassCard padding="lg">
        <div className="font-display font-bold text-ink-900 mb-4">Account</div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-brand-50 grid place-items-center flex-shrink-0">
              <Mail size={17} className="text-brand-700" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink-900">Email</div>
              <div className="text-xs text-ink-600">{user?.email}</div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-center">
        <button onClick={handleSignOut} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-error-500/10 text-error-600 px-6 py-3 text-sm font-semibold hover:bg-error-500/20 transition-colors">
          <LogOut size={17} /> Sign out of Puthumai Uzhavan
        </button>
      </div>
    </div>
  );
}
