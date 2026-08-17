import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { supabase } from '@/lib/supabase';

function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('expired') || m.includes('invalid') || m.includes('token'))
    return 'This reset link has expired or is invalid. Please request a new one.';
  if (m.includes('weak password') || m.includes('password should'))
    return 'Please choose a stronger password (at least 6 characters).';
  if (m.includes('network') || m.includes('fetch'))
    return 'Network error. Please check your connection and try again.';
  return msg;
}

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-400' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-yellow-400' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-blue-400' };
  return { score, label: 'Strong', color: 'bg-brand-500' };
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const strength = getPasswordStrength(password);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match. Please try again.'); return; }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) {
        setError(friendlyError(authError.message));
        return;
      }
      setDone(true);
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF7] p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-brand-50 grid place-items-center mb-5">
                <CheckCircle2 size={32} className="text-brand-600" />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-ink-900">Password updated!</h1>
              <p className="mt-3 text-ink-600">
                Your password has been changed successfully. Redirecting you to sign in…
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Go to sign in now
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display font-extrabold text-2xl text-ink-900">Set a new password</h1>
              <p className="mt-2 text-ink-600">Choose a strong password to keep your farm account secure.</p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                  {error.includes('expired') && (
                    <div className="mt-2">
                      <Link to="/forgot-password" className="font-semibold underline">
                        Request a new reset link →
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
                <div>
                  <label htmlFor="new-password" className="text-sm font-semibold text-ink-900">New password</label>
                  <div className="mt-1.5 relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 pointer-events-none" />
                    <input
                      id="new-password"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="At least 6 characters"
                      className="w-full rounded-lg bg-gray-50 border border-gray-200 pl-11 pr-12 py-3.5 text-ink-900 placeholder:text-ink-600/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-600 hover:text-ink-900"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 h-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-ink-500">Password strength: <span className="font-semibold">{strength.label}</span></p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-new-password" className="text-sm font-semibold text-ink-900">Confirm new password</label>
                  <div className="mt-1.5 relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 pointer-events-none" />
                    <input
                      id="confirm-new-password"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                      placeholder="Re-enter your new password"
                      className={`w-full rounded-lg bg-gray-50 border pl-11 pr-12 py-3.5 text-ink-900 placeholder:text-ink-600/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition ${
                        confirm && confirm !== password ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-600 hover:text-ink-900"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Updating password…</>
                  ) : 'Update password'}
                </button>
              </form>

              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                <ArrowLeft size={16} /> Back to sign in
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
