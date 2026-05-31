'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import type { CoupleInfo } from '@amigitos/shared';

export function CoupleManager() {
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
        <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-900/40 border border-red-700/30 text-red-300 text-sm px-4 py-2.5 rounded-2xl">{error}</div>
      )}
      {success && (
        <div className="bg-green-900/40 border border-green-700/30 text-green-300 text-sm px-4 py-2.5 rounded-2xl">{success}</div>
      )}

      {couple ? (
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-display text-lg flex items-center gap-2">💞 Pareja</h3>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              couple.status === 'ACTIVE' ? 'bg-green-900/40 text-green-300 border border-green-700/30' : 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/30'
            }`}>
              {couple.status === 'ACTIVE' ? 'Activa' : 'Pendiente'}
            </span>
          </div>

          {couple.status === 'PENDING' && isInviter && (
            <p className="text-sm text-slate-400">Esperando que tu pareja acepte...</p>
          )}

          {couple.status === 'PENDING' && !isInviter && (
            <button onClick={() => handleAccept(couple.id)} disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-sm font-bold shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
            >
              {loading ? 'Aceptando...' : '✓ Aceptar Invitación'}
            </button>
          )}

          {couple.status === 'ACTIVE' && (
            <p className="text-sm text-slate-400">{isInviter ? 'Iniciaste la pareja' : 'Aceptaste la invitación'}</p>
          )}

          <button onClick={handleDissolve} disabled={loading}
            className="w-full px-4 py-2.5 bg-red-900/20 border border-red-700/30 rounded-2xl text-sm text-red-400 font-semibold active:scale-[0.98] transition-all"
          >
            {loading ? '...' : 'Disolver Pareja'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-5 space-y-3 shadow-xl">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Invitaciones</h3>
              {pending.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between bg-slate-700/30 rounded-2xl p-4">
                  <span className="text-sm text-slate-300">Te invitaron a una pareja</span>
                  <button onClick={() => handleAccept(inv.id)} disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-xs font-bold active:scale-95 transition-all"
                  >
                    {loading ? '...' : 'Aceptar'}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Invitar Pareja</h3>
            <p className="text-xs text-slate-500">Ingresa su email para compartir mascotas</p>
            <form onSubmit={handleInvite} className="flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@ejemplo.com" required
                className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-2xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all" />
              <button type="submit" disabled={loading || !email}
                className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-sm font-bold shadow-lg shadow-green-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? '...' : 'Invitar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
