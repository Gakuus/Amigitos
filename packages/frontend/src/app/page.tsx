'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room } from '@/components/room/Room';
import { AdoptModal } from '@/components/pet/AdoptModal';
import { CoupleManager } from '@/components/couple/CoupleManager';
import { ShopModal } from '@/components/shop/ShopModal';
import { GameModal } from '@/components/games/GameModal';
import { usePetStore } from '@/stores/pet.store';
import { useAuthStore } from '@/stores/auth.store';

import {
  Home, PawPrint, Sparkles, Shirt, LogOut, Trophy, Coins, HeartHandshake, User,
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
    if (!isAuthenticated) router.replace('/login');
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

  if (authLoading || !isAuthenticated) {
    if (authLoading) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-pastel-cream via-pastel-pink/30 to-pastel-sky/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-[3px] border-pastel-purple border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-pastel-foreground animate-pulse-soft">Cargando...</p>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-pastel-cream via-pastel-pink/20 to-pastel-sky/20 dark:from-slate-900 dark:via-[#0b1120] dark:to-slate-900">
      {/* ===== Top Header ===== */}
      <header className="sticky top-0 z-40 glass-strong border-b border-pastel-border/50 dark:border-surface-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-pastel-purple to-pastel-pink rounded-xl flex items-center justify-center shadow-lg shadow-pastel-purple/20">
              <PawPrint size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-pastel-purple via-pastel-pink to-pastel-purple bg-clip-text text-transparent font-display">
              Amigitos
            </h1>
          </div>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">

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
              <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-pastel-purple/20 to-pastel-pink/10 rounded-full flex items-center justify-center border-2 border-pastel-purple/20">
                <Home size={56} className="text-pastel-purple/60 animate-bounce-gentle" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-pastel-foreground dark:text-white">
                  ¡La habitación está vacía!
                </h2>
                <p className="text-pastel-muted dark:text-slate-400 max-w-xs mx-auto text-sm">
                  Adopta una mascota para que viva aquí.
                </p>
              </div>
              <button
                onClick={() => setShowAdopt(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-pastel-purple to-pastel-pink hover:brightness-110 rounded-2xl font-bold shadow-lg shadow-pastel-purple/25 active:scale-95 transition-all text-white"
              >
                <Sparkles size={16} className="inline mr-1.5 -mt-0.5" />
                Adoptar Mascota
              </button>
            </div>
          )}

          {/* Home tab */}
          {tab === 'home' && !loading && pets.length > 0 && (
            <div className="flex-1 flex flex-col">
              <Room
                userCoins={user?.coins}
                userName={user?.name}
                showWardrobe={showWardrobe}
                outfit={outfit}
                onWardrobeToggle={() => setShowWardrobe(!showWardrobe)}
                onWardrobeEquip={refreshOutfit}
                onOpenShop={() => setTab('shop')}
                onOpenGames={() => setTab('games')}
                onOpenCouple={() => setTab('couple')}
                onOpenProfile={() => setTab('profile')}
                onOpenAdopt={() => setShowAdopt(true)}
              />
            </div>
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
              <div className="bg-white/80 dark:bg-surface-card/80 rounded-3xl p-6 border border-pastel-border/30 dark:border-surface-border/50 space-y-5 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pastel-purple to-pastel-pink rounded-2xl flex items-center justify-center text-2xl font-bold text-white font-display shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold font-display text-pastel-foreground dark:text-white">{user?.name ?? 'Usuario'}</h2>
                    <p className="text-sm text-pastel-muted dark:text-slate-400">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-pastel-card/50 dark:bg-surface/50 rounded-2xl p-4 text-center space-y-1.5 border border-pastel-border/20 dark:border-surface-border/30">
                    <Coins size={24} className="mx-auto text-pastel-orange" />
                    <p className="text-lg font-bold text-pastel-orange">{user?.coins ?? 0}</p>
                    <p className="text-[10px] text-pastel-muted dark:text-slate-500 font-medium uppercase tracking-wider">Monedas</p>
                  </div>
                  <div className="bg-pastel-card/50 dark:bg-surface/50 rounded-2xl p-4 text-center space-y-1.5 border border-pastel-border/20 dark:border-surface-border/30">
                    <PawPrint size={24} className="mx-auto text-pastel-purple" />
                    <p className="text-lg font-bold text-pastel-purple">{pets.length}</p>
                    <p className="text-[10px] text-pastel-muted dark:text-slate-500 font-medium uppercase tracking-wider">Mascotas</p>
                  </div>
                  <div className="bg-pastel-card/50 dark:bg-surface/50 rounded-2xl p-4 text-center space-y-1.5 border border-pastel-border/20 dark:border-surface-border/30">
                    <Trophy size={24} className="mx-auto text-pastel-lavender" />
                    <p className="text-lg font-bold text-pastel-lavender">-</p>
                    <p className="text-[10px] text-pastel-muted dark:text-slate-500 font-medium uppercase tracking-wider">Logros</p>
                  </div>
                </div>

                {showCouple && <CoupleManager onClose={() => setShowCouple(false)} />}
                {!showCouple && (
                  <button
                    onClick={() => setShowCouple(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-pastel-coral/15 border border-pastel-coral/25 rounded-2xl text-sm text-pastel-coral font-semibold hover:bg-pastel-coral/25 active:scale-[0.98] transition-all"
                  >
                    <HeartHandshake size={18} />
                    Gestionar Pareja
                  </button>
                )}

                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-pastel-card/60 dark:bg-surface/50 hover:bg-pastel-rose/30 dark:hover:bg-red-900/20 border border-pastel-border/20 dark:border-surface-border/50 hover:border-pastel-coral/30 dark:hover:border-red-700/30 rounded-2xl text-sm text-pastel-muted dark:text-slate-400 hover:text-pastel-coral dark:hover:text-red-300 font-semibold active:scale-[0.98] transition-all"
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

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
