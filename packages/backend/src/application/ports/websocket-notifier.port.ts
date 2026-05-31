export interface WebSocketNotifierPort {
  notifyPetState(petId: string, state: Record<string, unknown>): void;
  notifyPetFed(petId: string, userId: string, hunger: number): void;
  notifyPetPlayed(petId: string, userId: string, happiness: number): void;
  notifyPetBathed(petId: string, userId: string, hygiene: number): void;
  notifyPetEvolved(petId: string, newLevel: number): void;
  notifyPetMoodChange(petId: string, oldMood: string, newMood: string): void;
  notifyPartnerAction(userId: string, type: string, petId: string): void;
  notifyError(userId: string, code: string, message: string): void;
}
