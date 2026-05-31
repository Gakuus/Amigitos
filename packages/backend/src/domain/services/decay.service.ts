import { Pet } from '../pet/pet.entity';

export class DecayService {
  applyDecay(pet: Pet, lastUpdate: Date, currentTime: Date = new Date()): void {
    const hoursPassed = (currentTime.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    if (hoursPassed <= 0) return;
    pet.decay(hoursPassed);
  }
}
