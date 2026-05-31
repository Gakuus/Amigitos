import { describe, it, expect } from 'vitest';
import { Couple, CoupleId } from './couple.entity';

describe('Couple Entity', () => {
  const createCouple = () =>
    new Couple({
      user1Id: 'user-1',
      user2Id: 'user-2',
      invitedBy: 'user-1',
    });

  describe('creation', () => {
    it('should create a pending couple', () => {
      const couple = createCouple();
      expect(couple.isActive()).toBe(false);
      expect(couple.invitedBy).toBe('user-1');
    });

    it('should reject same user', () => {
      expect(
        () =>
          new Couple({
            user1Id: 'same-user',
            user2Id: 'same-user',
            invitedBy: 'same-user',
          }),
      ).toThrow();
    });
  });

  describe('acceptance', () => {
    it('should activate the couple', () => {
      const couple = createCouple();
      couple.accept('user-2');
      expect(couple.isActive()).toBe(true);
      expect(couple.acceptedAt).toBeTruthy();
    });

    it('should reject acceptance by inviter', () => {
      const couple = createCouple();
      expect(() => couple.accept('user-1')).toThrow();
    });

    it('should reject acceptance by stranger', () => {
      const couple = createCouple();
      expect(() => couple.accept('user-3')).toThrow();
    });
  });

  describe('getPartner', () => {
    it('should return the other user', () => {
      const couple = createCouple();
      expect(couple.getPartner('user-1')).toBe('user-2');
      expect(couple.getPartner('user-2')).toBe('user-1');
    });

    it('should throw for non-member', () => {
      const couple = createCouple();
      expect(() => couple.getPartner('user-3')).toThrow();
    });
  });

  describe('dissolve', () => {
    it('should dissolve an active couple', () => {
      const couple = createCouple();
      couple.accept('user-2');
      couple.dissolve();
      expect(couple.isActive()).toBe(false);
    });

    it('should reject dissolving a pending couple', () => {
      const couple = createCouple();
      expect(() => couple.dissolve()).toThrow();
    });
  });
});
