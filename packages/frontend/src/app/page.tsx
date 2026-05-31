'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PetSprite } from '@/components/pet/PetSprite';
import { PetStats } from '@/components/pet/PetStats';
import { PetActions } from '@/components/pet/PetActions';
import { PetSelector } from '@/components/pet/PetSelector';
import { AdoptModal } from '@/components/pet/AdoptModal';
import { Wardrobe } from '@/components/pet/Wardrobe';
import { usePetStore } from '@/stores/pet.store';
import { useAuthStore } from '@/stores/auth.store';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuthStore();
  const {
    pets, pet, outfit, activePetId, loading,
    fetchPets, selectPet, adoptPet, refreshOutfit,
  } = usePetStore();
  const [showAdopt, setShowAdopt] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchPets();
  }, [isAuthenticated, fetchPets]);

  useEffect(() => {
    if (pets.length > 0 && !activePetId) {
      selectPet(pets[0]!.id);
    }
  }, [pets, activePetId, selectPet]);

  const handleAdopt = async (name: string, species: string) => {
    const newPetId = await adoptPet(name, species);
    if (newPetId) {
      selectPet(newPetId);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          Amigitos 🐾
        </h1>
        <nav className="flex items-center gap-4 text-sm text-slate-400">
          <span className="text-green-400 font-medium">Mis Mascotas</span>
          <span>Pareja</span>
          <div className="flex items-center gap-2 pl-4 border-l border-slate-700">
            <span className="text-slate-300">{user?.name}</span>
            <button onClick={logout} className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              Salir
            </button>
          </div>
        </nav>
      </header>

      <PetSelector
        pets={pets}
        activePetId={activePetId}
        onSelect={selectPet}
        onAdopt={() => setShowAdopt(true)}
      />

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
        </div>
      )}

      {!loading && !pet && pets.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-48 h-48 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-6xl">🐣</span>
            </div>
            <h2 className="text-xl font-semibold">¡Aún no tienes mascotas!</h2>
            <p className="text-slate-400">Adopta una mascota para empezar a cuidarla con tu pareja</p>
            <button
              onClick={() => setShowAdopt(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium transition-colors"
            >
              Adoptar Mascota
            </button>
          </div>
        </div>
      )}

      {pet && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-square bg-slate-800 rounded-2xl flex items-center justify-center max-h-[500px]">
              <PetSprite species={pet.species} mood={pet.mood} isSleeping={pet.isSleeping} size={300} />
            </div>
            <Wardrobe
              petId={pet.id}
              species={pet.species}
              outfit={outfit}
              onEquip={refreshOutfit}
            />
          </div>
          <div className="space-y-4">
            <PetStats pet={pet} />
            <PetActions petId={pet.id} />
          </div>
        </div>
      )}

      {showAdopt && (
        <AdoptModal
          onClose={() => setShowAdopt(false)}
          onAdopted={(petId) => selectPet(petId)}
        />
      )}
    </main>
  );
}
