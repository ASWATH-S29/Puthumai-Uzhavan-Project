import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { supabase } from '@/lib/supabase';

function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many requests. Please wait a moment and try again.';
  if (m.includes('network') || m.includes('fetch')) return 'Network error. Please check your connection.';
  if (m.includes('invalid email') || m.includes('email format')) return 'Please enter a valid email address.';
  return msg;
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (authError) {
        setError(friendlyError(authError.message));
        return;
      }
      setSent(true);
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
          {sent ? (
            <div className="text-center py-4">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-brand-50 grid place-items-center mb-5">
                <CheckCircle2 size={32} className="text-brand-600" />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-ink-900">Check your inbox</h1>
              <p className="mt-3 text-ink-600 leading-relaxed">
                We've sent a password reset link to{' '}
                <span className="font-semibold text-ink-900">{email}</span>.
                Click the link in that email to set a new password.
              </p>
              <p className="mt-3 text-sm text-ink-500">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  try again
                </button>.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                <ArrowLeft size={16} /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display font-extrabold text-2xl text-ink-900">Forgot your password?</h1>
              <p className="mt-2 text-ink-600">
                No worries — enter your email address and we'll send you a reset link.
              </p>

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
                  <label htmlFor="forgot-email" className="text-sm font-semibold text-ink-900">Email address</label>
                  <div className="mt-1.5 relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-600 pointer-events-none" />
                    <input
                      id="forgot-email"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Sending reset link…</>
                  ) : 'Send reset link'}
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

        <p className="mt-6 text-center text-sm text-ink-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
