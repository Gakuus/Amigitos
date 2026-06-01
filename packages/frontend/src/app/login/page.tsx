'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { PawPrint, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, error: authError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) router.push('/');
    else setError(useAuthStore.getState().error);
  };

  if (authLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-pastel-pink via-pastel-cream to-pastel-lavender dark:from-slate-900 dark:via-[#0b1120] dark:to-slate-900">
        <div className="animate-spin w-8 h-8 border-2 border-pastel-purple dark:border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-pastel-pink via-pastel-cream to-pastel-lavender dark:from-slate-900 dark:via-[#0b1120] dark:to-slate-900">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pastel-purple to-pastel-coral rounded-3xl flex items-center justify-center shadow-xl shadow-pastel-purple/30 dark:shadow-brand-500/20 animate-bounce-gentle">
              <PawPrint size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-pastel-purple via-pastel-coral to-pastel-purple bg-clip-text text-transparent dark:from-brand-400 dark:via-emerald-300 dark:to-brand-400">
                Amigitos
              </h1>
              <p className="text-pastel-muted dark:text-slate-400 text-sm mt-1.5">¡Bienvenido de vuelta!</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-pastel-muted dark:text-slate-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pastel-purple/50 dark:text-slate-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-slate-800/80 border border-pastel-purple/20 dark:border-surface-border/50 rounded-2xl text-pastel-foreground dark:text-slate-100 placeholder-pastel-muted dark:placeholder-slate-500 focus:outline-none focus:border-pastel-purple/50 dark:focus:border-brand-500/50 transition-all text-sm backdrop-blur-sm"
                  placeholder="tu@email.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-pastel-muted dark:text-slate-400 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pastel-purple/50 dark:text-slate-500" />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-10 py-3 bg-white/70 dark:bg-slate-800/80 border border-pastel-purple/20 dark:border-surface-border/50 rounded-2xl text-pastel-foreground dark:text-slate-100 placeholder-pastel-muted dark:placeholder-slate-500 focus:outline-none focus:border-pastel-purple/50 dark:focus:border-brand-500/50 transition-all text-sm backdrop-blur-sm"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-pastel-muted dark:text-slate-500 hover:text-pastel-purple dark:hover:text-slate-300">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {(error || authError) && (
              <div className="px-4 py-3 bg-pastel-coral/20 dark:bg-red-900/40 border border-pastel-coral/30 dark:border-red-700/30 rounded-2xl text-sm text-pastel-coral dark:text-red-300 flex items-start gap-2">
                <span>⚠️</span><span>{error ?? authError}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pastel-purple to-pastel-coral hover:from-pastel-purple-dark hover:to-pastel-coral-dark disabled:opacity-50 rounded-2xl font-bold text-sm shadow-lg shadow-pastel-purple/30 dark:shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <><LogIn size={18} /> Iniciar Sesión</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-pastel-muted dark:text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-pastel-purple dark:text-brand-400 hover:text-pastel-purple-dark dark:hover:text-brand-300 font-semibold">
              Registrarse
            </Link>
          </p>
        </div>
      </div>
      <div className="h-20 bg-gradient-to-t from-pastel-purple/10 dark:from-brand-500/5 to-transparent" />
    </div>
  );
}
