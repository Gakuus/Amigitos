'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
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
    if (name.trim().length < 2) { setError('El nombre debe tener al menos 2 caracteres'); return; }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
    setLoading(true);
    const ok = await register(email, name, password);
    setLoading(false);
    if (ok) router.push('/');
    else setError(useAuthStore.getState().error);
  };

  if (authLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/20 animate-bounce-gentle">
              <span className="text-4xl">🐾</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-transparent">
                Amigitos
              </h1>
              <p className="text-slate-400 text-sm mt-1">Crea tu cuenta y adopta mascotas</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">📧</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-9 pr-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 transition-all text-sm"
                  placeholder="tu@email.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">👤</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required minLength={2}
                  className="w-full pl-9 pr-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 transition-all text-sm"
                  placeholder="Tu nombre" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔒</span>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  className="w-full pl-9 pr-10 py-3 bg-slate-800/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 transition-all text-sm"
                  placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs">
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmar Contraseña</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 transition-all text-sm"
                placeholder="Repite la contraseña" />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-900/40 border border-red-700/30 rounded-2xl text-sm text-red-300 flex items-start gap-2">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:opacity-50 rounded-2xl font-bold text-sm shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Creando cuenta...
                </span>
              ) : '✨ Crear Cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-green-400 hover:text-green-300 font-semibold">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
      <div className="h-20 bg-gradient-to-t from-green-500/5 to-transparent" />
    </div>
  );
}
