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
import {
  Home, Gamepad2, ShoppingBag, HeartHandshake, User,
  PawPrint, Sparkles, Shirt, LogOut, Trophy, Coins,
} from 'lucide-react';

type Tab = 'home' | 'games' | 'shop' | 'couple' | 'profile';

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
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#0b1120] to-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 animate-pulse-soft">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const activePet = activePetId ? petMap[activePetId] : null;

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Inicio', icon: <Home size={22} /> },
    { id: 'games', label: 'Juegos', icon: <Gamepad2 size={22} /> },
    { id: 'shop', label: 'Tienda', icon: <ShoppingBag size={22} /> },
    { id: 'couple', label: 'Pareja', icon: <HeartHandshake size={22} /> },
    { id: 'profile', label: 'Perfil', icon: <User size={22} /> },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-slate-900 via-[#0b1120] to-slate-900">
      {/* ===== Top Header ===== */}
      <header className="sticky top-0 z-40 glass-strong border-b border-surface-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <PawPrint size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-brand-400 via-emerald-300 to-brand-400 bg-clip-text text-transparent font-display">
              Amigitos
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {user?.coins !== undefined && (
              <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-sm">
                <Coins size={16} className="text-amber-400" />
                <span className="font-bold text-amber-400">{user.coins}</span>
              </span>
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
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500 animate-pulse-soft">Cargando mascotas...</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && pets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-5 animate-fade-in">
              <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-brand-500/20 to-emerald-500/10 rounded-full flex items-center justify-center border-2 border-brand-500/20">
                <Home size={56} className="text-brand-400/60 animate-bounce-gentle" />
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
                className="px-8 py-3.5 bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-400 hover:to-emerald-400 rounded-2xl font-bold shadow-lg shadow-brand-500/25 active:scale-95 transition-all"
              >
                <Sparkles size={16} className="inline mr-1.5 -mt-0.5" />
                Adoptar Mascota
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

          {/* Home tab */}
          {tab === 'home' && !loading && pets.length > 0 && (
            <>
              <Room />

              {activePet && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <PetStats pet={activePet} />
                    <button
                      onClick={() => setShowWardrobe(!showWardrobe)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-purple-600/15 border border-purple-600/25 rounded-2xl text-sm text-purple-300 font-semibold hover:bg-purple-600/25 active:scale-[0.98] transition-all"
                    >
                      <Shirt size={18} />
                      {showWardrobe ? 'Cerrar armario' : 'Armario'}
                    </button>
                  </div>
                  <div className="space-y-4">
                    <PetActions petId={activePet.id} />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowGames(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-purple-600/25 to-coral-500/20 border border-purple-600/25 rounded-2xl text-sm text-purple-300 font-semibold hover:from-purple-600/35 hover:to-coral-500/30 active:scale-[0.98] transition-all"
                      >
                        <Gamepad2 size={18} />
                        Jugar
                      </button>
                      <button
                        onClick={() => setShowShop(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-amber-600/20 to-warm-500/20 border border-amber-600/25 rounded-2xl text-sm text-amber-300 font-semibold hover:from-amber-600/30 hover:to-warm-500/30 active:scale-[0.98] transition-all"
                      >
                        <ShoppingBag size={18} />
                        Tienda
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

          {/* Shop tab */}
          {tab === 'shop' && (
            <div className="animate-fade-in">
              <ShopModal onClose={() => setTab('home')} />
            </div>
          )}

          {/* Games tab */}
          {tab === 'games' && (
            <div className="animate-fade-in">
              <GameModal onClose={() => setTab('home')} />
            </div>
          )}

          {/* Couple tab */}
          {tab === 'couple' && (
            <div className="animate-fade-in">
              <CoupleManager onClose={() => setTab('home')} />
            </div>
          )}

          {/* Profile tab */}
          {tab === 'profile' && (
            <div className="animate-fade-in">
              <div className="bg-surface-card/80 rounded-3xl p-6 border border-surface-border/50 space-y-5 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white font-display shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold font-display">{user?.name ?? 'Usuario'}</h2>
                    <p className="text-sm text-slate-400">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-surface/50 rounded-2xl p-4 text-center space-y-1.5 border border-surface-border/30">
                    <Coins size={24} className="mx-auto text-amber-400" />
                    <p className="text-lg font-bold text-amber-400">{user?.coins ?? 0}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Monedas</p>
                  </div>
                  <div className="bg-surface/50 rounded-2xl p-4 text-center space-y-1.5 border border-surface-border/30">
                    <PawPrint size={24} className="mx-auto text-brand-400" />
                    <p className="text-lg font-bold text-brand-400">{pets.length}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Mascotas</p>
                  </div>
                  <div className="bg-surface/50 rounded-2xl p-4 text-center space-y-1.5 border border-surface-border/30">
                    <Trophy size={24} className="mx-auto text-purple-400" />
                    <p className="text-lg font-bold text-purple-400">-</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Logros</p>
                  </div>
                </div>

                {showCouple && <CoupleManager onClose={() => setShowCouple(false)} />}
                {!showCouple && (
                  <button
                    onClick={() => setShowCouple(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-coral-600/15 border border-coral-600/25 rounded-2xl text-sm text-coral-300 font-semibold hover:bg-coral-600/25 active:scale-[0.98] transition-all"
                  >
                    <HeartHandshake size={18} />
                    Gestionar Pareja
                  </button>
                )}

                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-surface/50 hover:bg-red-900/20 border border-surface-border/50 hover:border-red-700/30 rounded-2xl text-sm text-slate-400 hover:text-red-300 font-semibold active:scale-[0.98] transition-all"
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===== Bottom Navigation ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-surface-border/50 pb-safe">
        <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all min-w-0 ${
                tab === item.id
                  ? 'text-brand-400 scale-110'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className={`transition-transform ${tab === item.id ? 'animate-bounce-gentle' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-semibold ${tab === item.id ? 'text-brand-400' : 'text-slate-500'}`}>
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
