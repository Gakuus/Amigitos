'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room } from '@/components/room/Room';
import { PetSelector } from '@/components/pet/PetSelector';
import { PetStats } from '@/components/pet/PetStats';
import { PetActions } from '@/components/pet/PetActions';
import { AdoptModal } from '@/components/pet/AdoptModal';
import { CoupleManager } from '@/components/couple/CoupleManager';
import { ShopModal } from '@/components/shop/ShopModal';
import { GameModal } from '@/components/games/GameModal';
import { Wardrobe } from '@/components/pet/Wardrobe';
import { usePetStore } from '@/stores/pet.store';
import { useAuthStore } from '@/stores/auth.store';

type Tab = 'home' | 'shop' | 'games' | 'couple' | 'profile';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuthStore();
  const { pets, pet, petMap, activePetId, loading, fetchPets, selectPet, adoptPet, outfit, refreshOutfit } = usePetStore();
  const [showAdopt, setShowAdopt] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showCouple, setShowCouple] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [tab, setTab] = useState<Tab>('home');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) router.push('/login');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchPets();
  }, [isAuthenticated, fetchPets]);

  useEffect(() => {
    if (pets.length > 0 && !activePetId) {
      const firstPet = pets[0];
      if (firstPet) selectPet(firstPet.id);
    }
  }, [pets, activePetId, selectPet]);

  const handleAdopt = async (name: string, species: string) => {
    const newPetId = await adoptPet(name, species);
    if (newPetId) {
      await selectPet(newPetId);
      setShowAdopt(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 animate-pulse-soft">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const activePet = activePetId ? petMap[activePetId] : null;

  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'games', label: 'Juegos', icon: '🎮' },
    { id: 'shop', label: 'Tienda', icon: '🛒' },
    { id: 'couple', label: 'Pareja', icon: '💞' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* ===== Top Header ===== */}
      <header className="sticky top-0 z-40 glass-strong border-b border-slate-700/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <h1 className="text-lg font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 bg-clip-text text-transparent font-display">
              Amigitos
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {user?.coins !== undefined && (
              <span className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-sm">
                <span>🪙</span>
                <span className="font-bold text-yellow-400">{user.coins}</span>
              </span>
            )}
            {user?.name && (
              <span className="text-sm text-slate-300 hidden sm:block">{user.name}</span>
            )}
          </div>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-4">

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500 animate-pulse-soft">Cargando mascotas...</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && pets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-5 animate-fade-in">
              <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-full flex items-center justify-center border-2 border-green-500/20">
                <span className="text-5xl sm:text-6xl animate-bounce-gentle">🏠</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  ¡La habitación está vacía!
                </h2>
                <p className="text-slate-400 max-w-xs mx-auto text-sm">
                  Adopta una mascota para que viva aquí.
                </p>
              </div>
              <button
                onClick={() => setShowAdopt(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-2xl font-bold shadow-lg shadow-green-500/25 active:scale-95 transition-all"
              >
                ✨ Adoptar Mascota
              </button>
            </div>
          )}

          {/* Pet Selector */}
          {!loading && pets.length > 0 && (
            <PetSelector
              pets={pets}
              activePetId={activePetId}
              onSelect={selectPet}
              onAdopt={() => setShowAdopt(true)}
            />
          )}

          {/* Home tab: Room + Stats + Actions */}
          {tab === 'home' && !loading && pets.length > 0 && (
            <>
              <Room />

              {activePet && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <PetStats pet={activePet} />
                    <button
                      onClick={() => setShowWardrobe(!showWardrobe)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 border border-purple-600/30 rounded-2xl text-sm text-purple-300 font-medium hover:bg-purple-600/30 active:scale-[0.98] transition-all"
                    >
                      👗 {showWardrobe ? 'Cerrar armario' : 'Armario'}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <PetActions petId={activePet.id} />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowGames(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-600/30 rounded-2xl text-sm text-purple-300 font-medium hover:from-purple-600/40 hover:to-pink-600/40 active:scale-[0.98] transition-all"
                      >
                        🎮 Jugar
                      </button>
                      <button
                        onClick={() => setShowShop(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border border-yellow-600/30 rounded-2xl text-sm text-yellow-300 font-medium hover:from-yellow-600/40 hover:to-orange-600/40 active:scale-[0.98] transition-all"
                      >
                        🛒 Tienda
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showWardrobe && activePet && (
                <div className="animate-slide-down">
                  <Wardrobe
                    petId={activePet.id}
                    species={activePet.species}
                    outfit={outfit}
                    onEquip={refreshOutfit}
                  />
                </div>
              )}
            </>
          )}

          {/* Games tab */}
          {tab === 'games' && !loading && (
            <div className="animate-fade-in">
              <div className="text-center py-8 space-y-4">
                <span className="text-5xl">🎮</span>
                <h2 className="text-xl font-bold font-display">Mini Juegos</h2>
                <p className="text-sm text-slate-400">¡Juega y gana monedas!</p>
                <GameModal onClose={() => setTab('home')} />
              </div>
            </div>
          )}

          {/* Shop tab */}
          {tab === 'shop' && !loading && (
            <div className="animate-fade-in">
              <ShopModal onClose={() => setTab('home')} />
            </div>
          )}

          {/* Couple tab */}
          {tab === 'couple' && (
            <div className="animate-fade-in">
              <CoupleManager />
            </div>
          )}

          {/* Profile tab */}
          {tab === 'profile' && (
            <div className="animate-fade-in">
              <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/50 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold text-white font-display shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold font-display">{user?.name ?? 'Usuario'}</h2>
                    <p className="text-sm text-slate-400">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-700/50 rounded-2xl p-4 text-center space-y-1">
                    <span className="text-2xl">🪙</span>
                    <p className="text-lg font-bold text-yellow-400">{user?.coins ?? 0}</p>
                    <p className="text-[10px] text-slate-500">Monedas</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-2xl p-4 text-center space-y-1">
                    <span className="text-2xl">🐾</span>
                    <p className="text-lg font-bold text-green-400">{pets.length}</p>
                    <p className="text-[10px] text-slate-500">Mascotas</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-2xl p-4 text-center space-y-1">
                    <span className="text-2xl">🏅</span>
                    <p className="text-lg font-bold text-purple-400">-</p>
                    <p className="text-[10px] text-slate-500">Logros</p>
                  </div>
                </div>

                {showCouple && <CoupleManager />}
                {!showCouple && (
                  <button
                    onClick={() => setShowCouple(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-600/20 border border-pink-600/30 rounded-2xl text-sm text-pink-300 font-medium hover:bg-pink-600/30 active:scale-[0.98] transition-all"
                  >
                    💞 Gestionar Pareja
                  </button>
                )}

                <button
                  onClick={logout}
                  className="w-full px-4 py-3 bg-slate-700/50 hover:bg-red-900/30 border border-slate-600/50 hover:border-red-700/30 rounded-2xl text-sm text-slate-400 hover:text-red-300 font-medium active:scale-[0.98] transition-all"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===== Bottom Navigation ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-slate-700/50 pb-safe">
        <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all min-w-0 ${
                tab === item.id
                  ? 'text-green-400 scale-110'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`text-xl transition-transform ${tab === item.id ? 'animate-bounce-gentle' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium ${tab === item.id ? 'text-green-400' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* ===== Modals ===== */}
      {showAdopt && (
        <AdoptModal
          onClose={() => setShowAdopt(false)}
          onAdopted={(petId) => selectPet(petId)}
          userCoupleId={user?.coupleId}
        />
      )}
    </div>
  );
}
