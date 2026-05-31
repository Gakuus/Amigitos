import { Pet } from '../pet/pet.entity';

export class DecayService {
  private static readonly DECAY_INTERVAL_HOURS = 1;
  private static readonly DECAY_PERCENT = 0.05;

  applyDecay(pet: Pet, lastUpdate: Date, currentTime: Date = new Date()): void {
    const hoursPassed = (currentTime.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    if (hoursPassed >= DecayService.DECAY_INTERVAL_HOURS) {
      pet.decay(Math.floor(hoursPassed));
    }
  }

  getTimeSinceLastUpdate(lastUpdate: Date, currentTime: Date = new Date()): number {
    return (currentTime.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
  }
}
