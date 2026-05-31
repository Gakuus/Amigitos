import { describe, it, expect } from 'vitest';
import { PetLevel } from './pet-level.value-object';
import { Hunger } from './hunger.value-object';
import { Happiness } from './happiness.value-object';
import { Energy } from './energy.value-object';
import { Hygiene } from './hygiene.value-object';
import { Experience } from './experience.value-object';

describe('Value Objects', () => {
  describe('PetLevel', () => {
    it('should create a valid level', () => {
      const level = PetLevel.create(5);
      expect(level.value).toBe(5);
    });

    it('should reject level below 1', () => {
      expect(() => PetLevel.create(0)).toThrow();
    });

    it('should reject level above 50', () => {
      expect(() => PetLevel.create(51)).toThrow();
    });
  });

  describe('Hunger', () => {
    it('should round the value', () => {
      const hunger = Hunger.create(75.7);
      expect(hunger.value).toBe(76);
    });

    it('should reject negative values', () => {
      expect(() => Hunger.create(-1)).toThrow();
    });

    it('should reject values over 100', () => {
      expect(() => Hunger.create(101)).toThrow();
    });
  });

  describe('Happiness', () => {
    it('should accept values in range', () => {
      const h = Happiness.create(50);
      expect(h.value).toBe(50);
    });
  });

  describe('Energy', () => {
    it('should accept zero', () => {
      const e = Energy.create(0);
      expect(e.value).toBe(0);
    });
  });

  describe('Hygiene', () => {
    it('should create a valid value', () => {
      const h = Hygiene.create(80);
      expect(h.value).toBe(80);
    });
  });

  describe('Experience', () => {
    it('should create zero experience', () => {
      const e = Experience.create(0);
      expect(e.value).toBe(0);
    });

    it('should reject negative', () => {
      expect(() => Experience.create(-5)).toThrow();
    });
  });
});
