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
    setLoading(true);
    setError(null);
    try {
      const [c, p] = await Promise.all([
        api.getMyCouple().catch(() => null),
        api.getPendingInvitations().catch(() => [] as CoupleInfo[]),
      ]);
      setCouple(c);
      setPending(p);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const result = await api.invitePartner(email);
      setCouple(result);
      setEmail('');
      setSuccess('Invitación enviada correctamente');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al invitar';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    setError(null);
    setLoading(true);
    try {
      const result = await api.acceptInvitation(id);
      setCouple(result);
      setPending([]);
      setSuccess('¡Pareja vinculada correctamente!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al aceptar';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDissolve = async () => {
    if (!couple) return;
    if (!confirm('¿Estás seguro de disolver la pareja? Se perderá el vínculo.')) return;
    setError(null);
    setLoading(true);
    try {
      await api.dissolveCouple(couple.id);
      setCouple(null);
      setSuccess('Pareja disuelta');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al disolver';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isInviter = couple && couple.invitedBy === user?.id;
  const partnerName = couple
    ? isInviter
      ? 'Tu pareja'
      : 'Tu pareja'
    : null;

  if (loading && !couple && pending.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-400">
        <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900/50 text-red-300 text-sm px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900/50 text-green-300 text-sm px-4 py-2 rounded-lg">
          {success}
        </div>
      )}

      {couple ? (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">💞 Pareja vinculada</h3>
              {couple.status === 'PENDING' && (
                <span className="text-xs bg-yellow-600/30 text-yellow-300 px-2 py-0.5 rounded-full">
                  Pendiente
                </span>
              )}
              {couple.status === 'ACTIVE' && (
                <span className="text-xs bg-green-600/30 text-green-300 px-2 py-0.5 rounded-full">
                  Activa
                </span>
              )}
            </div>

            {couple.status === 'PENDING' && isInviter && (
              <p className="text-sm text-slate-400">
                Esperando a que tu pareja acepte la invitación...
              </p>
            )}

            {couple.status === 'PENDING' && !isInviter && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(couple.id)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Aceptando...' : '✓ Aceptar invitación'}
                </button>
              </div>
            )}

            {couple.status === 'ACTIVE' && (
              <div>
                <p className="text-sm text-slate-400">
                  {isInviter
                    ? 'Iniciaste la pareja'
                    : 'Aceptaste la invitación'}
                </p>
              </div>
            )}

            <button
              onClick={handleDissolve}
              disabled={loading}
              className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            >
              {loading ? '...' : 'Disolver pareja'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pending invitations */}
          {pending.length > 0 && (
            <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                Invitaciones pendientes
              </h3>
              {pending.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between bg-slate-700/50 rounded-xl p-3"
                >
                  <div className="text-sm text-slate-300">
                    Te invitaron a una pareja
                  </div>
                  <button
                    onClick={() => handleAccept(inv.id)}
                    disabled={loading}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? '...' : 'Aceptar'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Invite form */}
          <div className="bg-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Invitar pareja
            </h3>
            <p className="text-xs text-slate-500">
              Ingresa el email de tu pareja o amigo para vincularse y compartir mascotas.
            </p>
            <form onSubmit={handleInvite} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                required
                className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={loading || !email}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
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
