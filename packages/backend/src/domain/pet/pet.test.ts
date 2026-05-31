import { describe, it, expect } from 'vitest';
import { Pet } from './pet.entity';
import { PetId } from './pet-id.value-object';
import { PetSpecies } from './pet-species';
import { PetMood } from './pet-mood';

function createTestPet(overrides: Partial<{
  id: PetId;
  name: string;
  species: PetSpecies;
  coupleId: string;
}> = {}) {
  return new Pet({
    id: overrides.id ?? PetId.create(),
    name: overrides.name ?? 'TestPet',
    species: overrides.species ?? PetSpecies.CAT,
    coupleId: overrides.coupleId ?? 'couple-1',
  });
}

describe('Pet Entity', () => {
  describe('creation', () => {
    it('should create a pet with default values', () => {
      const pet = createTestPet();
      expect(pet.name).toBe('TestPet');
      expect(pet.species).toBe(PetSpecies.CAT);
      expect(pet.level.value).toBe(1);
      expect(pet.hunger.value).toBe(100);
      expect(pet.happiness.value).toBe(100);
      expect(pet.energy.value).toBe(100);
      expect(pet.hygiene.value).toBe(100);
      expect(pet.mood).toBe(PetMood.HAPPY);
      expect(pet.isSleeping).toBe(false);
    });
  });

  describe('feed', () => {
    it('should increase hunger and happiness', () => {
      const pet = createTestPet();
      pet.decay(10);
      const initialHunger = pet.hunger.value;
      const initialHappiness = pet.happiness.value;

      pet.feed();

      expect(pet.hunger.value).toBeGreaterThan(initialHunger);
      expect(pet.happiness.value).toBeGreaterThanOrEqual(initialHappiness);
    });

    it('should cap hunger at 100', () => {
      const pet = createTestPet();
      pet.decay(50);
      for (let i = 0; i < 10; i++) {
        pet.feed();
      }
      expect(pet.hunger.value).toBe(100);
    });
  });

  describe('play', () => {
    it('should increase happiness and decrease energy', () => {
      const pet = createTestPet();
      pet.decay(5);
      const initialHappiness = pet.happiness.value;
      const initialEnergy = pet.energy.value;

      pet.play();

      expect(pet.happiness.value).toBeGreaterThan(initialHappiness);
      expect(pet.energy.value).toBeLessThan(initialEnergy);
    });
  });

  describe('bathe', () => {
    it('should increase hygiene', () => {
      const pet = createTestPet();
      pet.decay(10);
      const initialHygiene = pet.hygiene.value;

      pet.bathe();

      expect(pet.hygiene.value).toBeGreaterThan(initialHygiene);
    });
  });

  describe('sleep and wake', () => {
    it('should set sleeping state', () => {
      const pet = createTestPet();
      pet.sleep();
      expect(pet.isSleeping).toBe(true);
    });

    it('should regain energy when waking up', () => {
      const pet = createTestPet();
      pet.play(); // reduce energy
      const lowEnergy = pet.energy.value;
      pet.sleep();
      pet.wakeUp();
      expect(pet.energy.value).toBeGreaterThan(lowEnergy);
    });
  });

  describe('decay', () => {
    it('should reduce stats over time', () => {
      const pet = createTestPet();
      pet.decay(10);
      expect(pet.hunger.value).toBeLessThan(100);
      expect(pet.happiness.value).toBeLessThan(100);
      expect(pet.energy.value).toBeLessThan(100);
      expect(pet.hygiene.value).toBeLessThan(100);
    });
  });

  describe('mood calculation', () => {
    it('should be HAPPY when stats are high', () => {
      const pet = createTestPet();
      expect(pet.calculateMood()).toBe(PetMood.HAPPY);
    });

    it('should be SAD when stats are low', () => {
      const pet = createTestPet();
      pet.decay(100);
      expect(pet.calculateMood()).toBe(PetMood.SICK);
    });
  });

  describe('evolution', () => {
    it('should level up with enough experience', () => {
      const pet = createTestPet();
      const initialLevel = pet.level.value;

      for (let i = 0; i < 60; i++) {
        pet.feed();
      }

      expect(pet.level.value).toBeGreaterThan(initialLevel);
    });
  });

  describe('cooldown', () => {
    it('should prevent interaction within cooldown', () => {
      const pet = createTestPet();
      pet.feed();
      const result = pet.canInteract('FEED', 600_000);
      expect(result.success).toBe(false);
      expect(result.reason).toBe('COOLDOWN_ACTIVE');
    });

    it('should allow interaction when no cooldown', () => {
      const pet = createTestPet();
      const result = pet.canInteract('FEED', 600_000);
      expect(result.success).toBe(true);
    });
  });
});
