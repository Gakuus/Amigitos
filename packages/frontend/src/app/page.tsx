'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room } from '@/components/room/Room';
import { AdoptModal } from '@/components/pet/AdoptModal';
import { CoupleManager } from '@/components/couple/CoupleManager';
import { ShopModal } from '@/components/shop/ShopModal';
import { usePetStore } from '@/stores/pet.store';
import { useAuthStore } from '@/stores/auth.store';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuthStore();
  const { pets, loading, fetchPets, adoptPet, selectPet } = usePetStore();
  const [showAdopt, setShowAdopt] = useState(false);
  const [showCouple, setShowCouple] = useState(false);
  const [showShop, setShowShop] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchPets();
  }, [isAuthenticated, fetchPets]);

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
    <main className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Amigitos 🐾
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Habitación de mascotas</p>
          </div>
          <nav className="flex items-center gap-4 text-sm text-slate-400">
            <span className="text-green-400 font-medium">Mis Mascotas</span>
            <button onClick={() => setShowCouple(!showCouple)} className="hover:text-slate-200 transition-colors">
              {showCouple ? '▲ Pareja' : 'Pareja'}
            </button>
            <button
              onClick={() => setShowShop(true)}
              className="hover:text-yellow-400 transition-colors flex items-center gap-1"
            >
              🪙 Tienda
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-700">
              <span className="text-slate-300">{user?.name}</span>
              {user?.coins !== undefined && (
                <span className="text-yellow-400 text-xs">🪙 {user.coins}</span>
              )}
              <button
                onClick={logout}
                className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Salir
              </button>
            </div>
          </nav>
        </header>

        {/* Couple Manager */}
        {showCouple && (
          <div className="max-w-md mx-auto">
            <CoupleManager />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Empty state */}
        {!loading && pets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-32 h-32 bg-slate-800 rounded-2xl flex items-center justify-center">
              <span className="text-5xl">🏠</span>
            </div>
            <h2 className="text-xl font-semibold">¡La habitación está vacía!</h2>
            <p className="text-slate-400 max-w-md">
              Adopta una mascota para que viva aquí. Podrás verlas jugar, comer, bañarse y dormir todas juntas.
            </p>
            <button
              onClick={() => setShowAdopt(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium transition-colors"
            >
              Adoptar Mascota
            </button>
          </div>
        )}

        {/* Room */}
        {!loading && pets.length > 0 && <Room />}

        {/* Pet selector bar + adopt */}
        {pets.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <button
              onClick={() => setShowAdopt(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl font-medium text-sm transition-colors"
            >
              + Adoptar
            </button>
          </div>
        )}
      </div>

      {showAdopt && (
        <AdoptModal
          onClose={() => setShowAdopt(false)}
          onAdopted={(petId) => selectPet(petId)}
          userCoupleId={user?.coupleId}
        />
      )}

      {showShop && (
        <ShopModal onClose={() => setShowShop(false)} />
      )}
    </main>
  );
}
