'use client';

import { useState, useEffect } from 'react';
import { PetSpecies, PET_SPECIES_LABELS, MAX_PETS_PER_COUPLE } from '@amigitos/shared';
import { api } from '@/lib/api';
import { usePetStore } from '@/stores/pet.store';

interface AdoptModalProps {
  onClose: () => void;
  onAdopted: (petId: string) => void;
  userCoupleId?: string | null;
}

const speciesList = Object.entries(PET_SPECIES_LABELS).filter(
  ([key]) => key !== PetSpecies.CUSTOM,
);

export function AdoptModal({ onClose, onAdopted, userCoupleId }: AdoptModalProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<string>(PetSpecies.CAT);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { pets } = usePetStore();
  const petCount = pets.length;
  const atLimit = petCount >= MAX_PETS_PER_COUPLE;

  useEffect(() => {
    if (atLimit) setErrorMsg(`Límite de ${MAX_PETS_PER_COUPLE} mascotas alcanzado`);
    else setErrorMsg(null);
  }, [atLimit]);

  const handleAdopt = async () => {
    if (!name.trim() || name.length < 2 || atLimit) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const pet = await api.adoptPet(name.trim(), species);
      onAdopted(pet.id);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al adoptar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-800/95 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[85dvh] flex flex-col shadow-2xl border border-slate-700/50 sm:m-4 animate-slide-up sm:animate-pop">
        <div className="flex justify-center pt-2 pb-0 sm:hidden">
          <div className="w-10 h-1 bg-slate-600 rounded-full" />
        </div>

        <div className="px-5 pt-4 pb-3 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <span>🐣</span> Adoptar Mascota
          </h2>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${atLimit ? 'bg-red-900/40 text-red-300 border border-red-700/30' : 'bg-slate-700/50 text-slate-300'}`}>
              {petCount}/{MAX_PETS_PER_COUPLE}
            </span>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-700/50 text-slate-400 hover:text-white active:scale-90 transition-all">✕</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Pelusa"
              maxLength={20}
              className="w-full px-4 py-3 bg-slate-700/50 rounded-2xl border border-slate-600/50 focus:border-green-500/50 outline-none text-sm text-white placeholder-slate-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Especie</label>
            <div className="grid grid-cols-3 gap-2">
              {speciesList.map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSpecies(key)}
                  className={`p-3 rounded-2xl text-center text-xs font-semibold transition-all active:scale-[0.97] ${
                    species === key
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20 scale-105'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="px-4 py-3 bg-red-900/40 border border-red-700/30 rounded-2xl text-sm text-red-300">{errorMsg}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-slate-700/50 hover:bg-slate-700 text-sm font-semibold active:scale-[0.97] transition-all">
              Cancelar
            </button>
            <button
              onClick={handleAdopt}
              disabled={!name.trim() || name.length < 2 || loading || atLimit}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 disabled:opacity-40 text-sm font-bold shadow-lg shadow-green-500/20 active:scale-[0.97] transition-all"
            >
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" /> : '✨ ¡Adoptar!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
