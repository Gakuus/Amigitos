'use client';

import { useState, useEffect, useRef } from 'react';
import type { PetState } from '@amigitos/shared';
import { DECAY_RATE_PER_HOUR, MAX_STAT_VALUE, MIN_STAT_VALUE } from '@amigitos/shared';

function clamp(v: number) {
  return Math.max(MIN_STAT_VALUE, Math.min(MAX_STAT_VALUE, v));
}

const RATE = DECAY_RATE_PER_HOUR * MAX_STAT_VALUE;
const ENERGY_PER_HOUR = 20;

export function useSimulatedNeeds(pet: PetState | null) {
  const [simulated, setSimulated] = useState<PetState | null>(null);
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (!pet) {
      setSimulated(null);
      return;
    }

    lastTickRef.current = Date.now();
    setSimulated(pet);
  }, [pet]);

  useEffect(() => {
    if (!simulated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const hours = (now - lastTickRef.current) / (1000 * 60 * 60);
      lastTickRef.current = now;

      setSimulated((prev) => {
        if (!prev) return null;
        const sleeping = prev.isSleeping;
        const decay = sleeping ? 0 : hours * RATE;
        const energyBonus = sleeping ? hours * ENERGY_PER_HOUR : 0;
        return {
          ...prev,
          hunger: clamp(prev.hunger - decay),
          happiness: clamp(prev.happiness - decay),
          energy: clamp(prev.energy + energyBonus - decay),
          hygiene: clamp(prev.hygiene - decay),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!simulated, simulated?.id, simulated?.isSleeping]);

  return simulated;
}
