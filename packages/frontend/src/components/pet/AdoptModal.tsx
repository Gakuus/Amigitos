'use client';

import { useState } from 'react';
import { PetSpecies, PET_SPECIES_LABELS } from '@amigitos/shared';
import { api } from '@/lib/api';

interface AdoptModalProps {
  onClose: () => void;
  onAdopted: (petId: string) => void;
}

const speciesList = Object.entries(PET_SPECIES_LABELS).filter(
  ([key]) => key !== PetSpecies.CUSTOM,
);

export function AdoptModal({ onClose, onAdopted }: AdoptModalProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<string>(PetSpecies.CAT);
  const [loading, setLoading] = useState(false);

  const handleAdopt = async () => {
    if (!name.trim() || name.length < 2) return;
    setLoading(true);
    try {
      const pet = await api.adoptPet(name.trim(), species);
      onAdopted(pet.id);
      onClose();
    } catch (err) {
      console.error('Failed to adopt:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 space-y-5">
        <h2 className="text-xl font-semibold">Adoptar Mascota</h2>

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

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdopt}
            disabled={!name.trim() || name.length < 2 || loading}
            className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {loading ? 'Adoptando...' : '¡Adoptar!'}
          </button>
        </div>
      </div>
    </div>
  );
}
