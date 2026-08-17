import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Sprout, Check, Loader2 } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';

function friendlyAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('email already') || m.includes('already registered') || m.includes('user already'))
    return 'An account with this email already exists. Try signing in instead.';
  if (m.includes('weak password') || m.includes('password should'))
    return 'Please choose a stronger password (at least 6 characters).';
  if (m.includes('invalid email') || m.includes('email format'))
    return 'Please enter a valid email address.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts. Please wait a moment and try again.';
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

const perks = [
  'AI crop recommendations for your soil',
  'Hyperlocal weather & irrigation alerts',
  'Expense tracking with profit-per-acre',
  'Free to start — no credit card needed',
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError('');
  };

  const strength = getPasswordStrength(form.password);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Please enter your full name.'); return; }
    if (!form.email.trim()) { setError('Please enter your email address.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match. Please try again.'); return; }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { data: { full_name: form.name.trim() } },
      });
      if (authError) {
        setError(friendlyAuthError(authError.message));
        return;
      }
      if (data.user && !data.session) {
        toast('Account created! Please check your email to verify your account.', 'info');
        navigate('/login');
        return;
      }
      if (data.session) {
        toast('Welcome to Puthumai Uzhavan!', 'success');
        navigate('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left form */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-[#F8FAF7] order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>
          <div className="hidden lg:block mb-8">
            <Logo size="md" />
          </div>

          <h1 className="font-display font-extrabold text-3xl text-ink-900">Create your farming account</h1>
          <p className="mt-2 text-ink-600">Start managing your farm with smarter agricultural insights.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="text-sm font-semibold text-ink-900">Full name</label>
              <div className="mt-1.5 relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Murugan Ramasamy"
                  className="w-full rounded-lg bg-gray-50 border border-gray-200 pl-11 pr-4 py-3.5 text-ink-900 placeholder:text-ink-600/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="text-sm font-semibold text-ink-900">Email address</label>
              <div className="mt-1.5 relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 pointer-events-none" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  placeholder="farmer@puthumai.farm"
                  className="w-full rounded-lg bg-gray-50 border border-gray-200 pl-11 pr-4 py-3.5 text-ink-900 placeholder:text-ink-600/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="text-sm font-semibold text-ink-900">Password</label>
              <div className="mt-1.5 relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 pointer-events-none" />
                <input
                  id="reg-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={set('password')}
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
              {/* Password strength bar */}
              {form.password.length > 0 && (
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
              <label htmlFor="confirm-password" className="text-sm font-semibold text-ink-900">Confirm password</label>
              <div className="mt-1.5 relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 pointer-events-none" />
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Re-enter your password"
                  className={`w-full rounded-lg bg-gray-50 border pl-11 pr-12 py-3.5 text-ink-900 placeholder:text-ink-600/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition ${
                    form.confirm && form.confirm !== form.password ? 'border-red-300' : 'border-gray-200'
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
              {form.confirm && form.confirm !== form.password && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            <label className="flex items-start gap-2 text-sm text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-0.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              I agree to the Terms of Service and Privacy Policy
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Creating account…</>
              ) : 'Create farming account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Sign in
            </Link>
          </p>

          <div className="lg:hidden mt-4 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700">
              <ArrowLeft size={14} /> Back to home
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right visual */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-brand-600 p-12 order-1 lg:order-2">
        <div className="relative flex justify-end">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-100 text-sm font-semibold hover:text-white transition-colors">
            Back to home <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
        <div className="relative">
          <Sprout className="text-brand-200" size={40} />
          <h2 className="mt-6 font-display font-extrabold text-4xl text-white leading-tight">
            Join 2,400+ farmers growing smarter
          </h2>
          <p className="mt-4 text-brand-100 text-lg max-w-md">
            Everything you need to turn guesswork into precision — and precision into profit.
          </p>
          <ul className="mt-8 space-y-3 max-w-md">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-brand-50">
                <span className="h-6 w-6 rounded-full bg-white/15 grid place-items-center flex-shrink-0">
                  <Check size={14} className="text-white" />
                </span>
                <span className="font-medium">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-sm text-brand-100/70">© {new Date().getFullYear()} Puthumai Uzhavan</div>
      </div>
    </div>
  );
}
