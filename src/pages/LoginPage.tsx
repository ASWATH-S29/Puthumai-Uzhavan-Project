import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Leaf, Loader2 } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';

function friendlyAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login') || m.includes('invalid credentials') || m.includes('email not confirmed'))
    return 'Incorrect email or password. Please check your details.';
  if (m.includes('email already') || m.includes('already registered'))
    return 'An account with this email already exists. Try signing in.';
  if (m.includes('weak password') || m.includes('password should'))
    return 'Password must be at least 6 characters.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts. Please wait a moment and try again.';
  if (m.includes('network') || m.includes('fetch'))
    return 'Network error. Please check your connection and try again.';
  if (m.includes('user not found'))
    return 'No account found with that email. Please sign up first.';
  return msg;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) {
        setError(friendlyAuthError(authError.message));
        return;
      }
      toast('Welcome back, farmer!', 'success');
      navigate(from, { replace: true });
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-brand-600 p-12">
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-100 text-sm font-semibold hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
        <div className="relative">
          <Leaf className="text-brand-200" size={40} />
          <h2 className="mt-6 font-display font-extrabold text-4xl text-white leading-tight">
            Welcome back, Farmer
          </h2>
          <p className="mt-4 text-brand-100 text-lg max-w-md">
            Sign in to continue managing your farm with Puthumai Uzhavan.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { v: '2,400+', l: 'Active farms' },
              { v: '38%', l: 'Avg profit lift' },
              { v: '4.9★', l: 'Member rating' },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/10 p-4">
                <div className="font-display font-bold text-2xl text-white">{s.v}</div>
                <div className="text-xs text-brand-100 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-sm text-brand-100/70">© {new Date().getFullYear()} Puthumai Uzhavan</div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-[#F8FAF7]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          {/* Desktop logo in form area */}
          <div className="hidden lg:block mb-8">
            <Logo size="md" />
          </div>

          <h1 className="font-display font-extrabold text-3xl text-ink-900">Welcome back, Farmer</h1>
          <p className="mt-2 text-ink-600">Sign in to continue managing your farm with Puthumai Uzhavan.</p>

          {/* Inline error */}
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
              <label htmlFor="email" className="text-sm font-semibold text-ink-900">Email address</label>
              <div className="mt-1.5 relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="farmer@puthumai.farm"
                  className="w-full rounded-lg bg-gray-50 border border-gray-200 pl-11 pr-4 py-3.5 text-ink-900 placeholder:text-ink-600/50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-ink-900">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:text-brand-700">Forgot password?</Link>
              </div>
              <div className="mt-1.5 relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 pointer-events-none" />
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in…</>
              ) : 'Sign in to dashboard'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
              Create one free
            </Link>
          </p>

          {/* Mobile back link */}
          <div className="lg:hidden mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-700">
              <ArrowLeft size={14} /> Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
