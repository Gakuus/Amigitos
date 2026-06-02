'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import type { CoupleInfo } from '@amigitos/shared';
import { Send, Check, X, UserPlus, Heart, ArrowLeft } from 'lucide-react';

interface CoupleManagerProps {
  onClose?: () => void;
}

export function CoupleManager({ onClose }: CoupleManagerProps) {
  const { user } = useAuthStore();
  const [couple, setCouple] = useState<CoupleInfo | null>(null);
  const [pending, setPending] = useState<CoupleInfo[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [c, p] = await Promise.all([
        api.getMyCouple().catch(() => null),
        api.getPendingInvitations().catch(() => [] as CoupleInfo[]),
      ]);
      setCouple(c); setPending(p);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setSuccess(null); setLoading(true);
    try {
      const result = await api.invitePartner(email);
      setCouple(result); setEmail(''); setSuccess('Invitación enviada');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al invitar');
    } finally { setLoading(false); }
  };

  const handleAccept = async (id: string) => {
    setError(null); setLoading(true);
    try {
      const result = await api.acceptInvitation(id);
      setCouple(result); setPending([]); setSuccess('¡Pareja vinculada!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al aceptar');
    } finally { setLoading(false); }
  };

  const handleDissolve = async () => {
    if (!couple) return;
    if (!confirm('¿Estás seguro de disolver la pareja?')) return;
    setError(null); setLoading(true);
    try {
      await api.dissolveCouple(couple.id);
      setCouple(null); setSuccess('Pareja disuelta');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al disolver');
    } finally { setLoading(false); }
  };

  const isInviter = couple && couple.invitedBy === user?.id;

  if (loading && !couple && pending.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-6 h-6 border-2 border-pastel-purple dark:border-brand-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-pastel-coral/20 dark:bg-red-900/40 border border-pastel-coral/30 dark:border-red-700/30 text-pastel-coral dark:text-red-300 text-sm px-4 py-2.5 rounded-2xl">{error}</div>
      )}
      {success && (
        <div className="bg-pastel-purple/20 dark:bg-brand-900/40 border border-pastel-purple/30 dark:border-brand-700/30 text-pastel-purple dark:text-brand-300 text-sm px-4 py-2.5 rounded-2xl">{success}</div>
      )}

      {couple ? (
        <div className="bg-white/70 dark:bg-surface-card/80 border border-pastel-purple/15 dark:border-surface-border/50 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onClose && (
                <button onClick={onClose} className="text-pastel-muted dark:text-slate-400 hover:text-pastel-foreground dark:hover:text-white mr-1">
                  <ArrowLeft size={18} />
                </button>
              )}
              <h3 className="font-bold font-display text-lg flex items-center gap-2 text-pastel-foreground dark:text-white">
                <Heart size={20} className="text-pastel-coral dark:text-coral-400" fill="currentColor" />
                Pareja
              </h3>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              couple.status === 'ACTIVE' ? 'bg-pastel-purple/20 text-pastel-purple border border-pastel-purple/30 dark:bg-brand-900/40 dark:text-brand-300 dark:border-brand-700/30' : 'bg-pastel-yellow/20 text-pastel-yellow-dark border border-pastel-yellow/30 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/30'
            }`}>
              {couple.status === 'ACTIVE' ? 'Activa' : 'Pendiente'}
            </span>
          </div>

          {couple.status === 'PENDING' && isInviter && (
            <p className="text-sm text-pastel-muted dark:text-slate-400">Esperando que tu pareja acepte...</p>
          )}

          {couple.status === 'PENDING' && !isInviter && (
            <button onClick={() => handleAccept(couple.id)} disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-pastel-purple to-pastel-coral dark:from-brand-500 dark:to-emerald-500 rounded-2xl text-sm font-bold shadow-lg shadow-pastel-purple/30 dark:shadow-brand-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white"
            >
              {loading ? 'Aceptando...' : <><Check size={18} /> Aceptar Invitación</>}
            </button>
          )}

          {couple.status === 'ACTIVE' && (
            <p className="text-sm text-pastel-muted dark:text-slate-400">{isInviter ? 'Iniciaste la pareja' : 'Aceptaste la invitación'}</p>
          )}

          <button onClick={handleDissolve} disabled={loading}
            className="w-full px-4 py-2.5 bg-pastel-coral/20 dark:bg-red-900/20 border border-pastel-coral/30 dark:border-red-700/30 rounded-2xl text-sm text-pastel-coral dark:text-red-400 font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <X size={16} />
            {loading ? '...' : 'Disolver Pareja'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {onClose && (
            <button onClick={onClose} className="text-xs text-pastel-muted dark:text-slate-400 hover:text-pastel-foreground dark:hover:text-white flex items-center gap-1">
              <ArrowLeft size={14} /> Volver
            </button>
          )}

          {pending.length > 0 && (
            <div className="bg-white/70 dark:bg-surface-card/80 border border-pastel-purple/15 dark:border-surface-border/50 rounded-3xl p-5 space-y-3 shadow-xl">
              <h3 className="text-xs font-semibold text-pastel-muted dark:text-slate-400 uppercase tracking-wider">Invitaciones</h3>
              {pending.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between bg-pastel-lavender/20 dark:bg-slate-700/30 rounded-2xl p-4">
                  <span className="text-sm text-pastel-foreground dark:text-slate-300 flex items-center gap-2">
                    <UserPlus size={16} className="text-pastel-purple dark:text-brand-400" />
                    Te invitaron a una pareja
                  </span>
                  <button onClick={() => handleAccept(inv.id)} disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-pastel-purple to-pastel-coral dark:from-brand-500 dark:to-emerald-500 rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 text-white"
                  >
                    {loading ? '...' : <><Check size={14} /> Aceptar</>}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white/70 dark:bg-surface-card/80 border border-pastel-purple/15 dark:border-surface-border/50 rounded-3xl p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-semibold text-pastel-muted dark:text-slate-400 uppercase tracking-wider">Invitar Pareja</h3>
            <p className="text-xs text-pastel-muted/60 dark:text-slate-500">Ingresa su email para compartir mascotas</p>
            <form onSubmit={handleInvite} className="flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@ejemplo.com" required
                className="flex-1 bg-pastel-lavender/20 dark:bg-slate-700/50 border border-pastel-purple/20 dark:border-slate-600/50 rounded-2xl px-4 py-3 text-sm text-pastel-foreground dark:text-slate-200 placeholder-pastel-muted dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pastel-purple/30 dark:focus:ring-brand-500/30 transition-all" />
              <button type="submit" disabled={loading || !email}
                className="px-5 py-3 bg-gradient-to-r from-pastel-purple to-pastel-coral dark:from-brand-500 dark:to-emerald-500 rounded-2xl text-sm font-bold shadow-lg shadow-pastel-purple/20 dark:shadow-brand-500/10 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-1.5 text-white"
              >
                {loading ? '...' : <><Send size={16} /> Invitar</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
