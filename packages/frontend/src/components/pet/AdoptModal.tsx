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
    if (atLimit) {
      setErrorMsg(`Has alcanzado el límite de ${MAX_PETS_PER_COUPLE} mascotas por pareja`);
    } else {
      setErrorMsg(null);
    }
  }, [atLimit]);

  const handleAdopt = async () => {
    if (!name.trim() || name.length < 2) return;
    if (atLimit) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const pet = await api.adoptPet(name.trim(), species);
      onAdopted(pet.id);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al adoptar';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 space-y-5">
        <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Adoptar Mascota</h2>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${atLimit ? 'bg-red-900/50 text-red-300' : 'bg-slate-700 text-slate-300'}`}>
          {petCount}/{MAX_PETS_PER_COUPLE}
        </span>
      </div>

        <div>
          <label className="text-sm text-slate-400 mb-1 block">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ej: Pelusa"
            maxLength={20}
            className="w-full px-4 py-2.5 bg-slate-700 rounded-xl border border-slate-600 focus:border-green-500 outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400 mb-2 block">Especie</label>
          <div className="grid grid-cols-3 gap-2">
            {speciesList.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSpecies(key)}
                className={`p-3 rounded-xl text-center text-sm transition-all ${
                  species === key
                    ? 'bg-green-600 ring-2 ring-green-400'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="px-3 py-2 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-300">
            {errorMsg}
          </div>
        )}

        {atLimit && (
          <div className="px-3 py-2 bg-yellow-900/30 border border-yellow-700/30 rounded-lg text-sm text-yellow-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>Límite de {MAX_PETS_PER_COUPLE} mascotas alcanzado. Libera espacio o adopta con otra pareja.</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdopt}
            disabled={!name.trim() || name.length < 2 || loading || atLimit}
            className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {loading ? 'Adoptando...' : '¡Adoptar!'}
          </button>
        </div>
      </div>
    </div>
  );
}
