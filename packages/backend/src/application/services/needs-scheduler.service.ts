import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PetRepositoryPort } from '../ports/pet-repository.port';
import { WebSocketNotifierPort } from '../ports/websocket-notifier.port';
import { DecayService } from '../../domain/services/decay.service';

@Injectable()
export class NeedsSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(NeedsSchedulerService.name);
  private readonly decayService = new DecayService();
  private readonly DECAY_INTERVAL_MS = 15 * 60 * 1000;

  constructor(
    private readonly petRepo: PetRepositoryPort,
    private readonly wsNotifier: WebSocketNotifierPort,
  ) {}

  onModuleInit(): void {
    setInterval(() => this.decayAllPets(), this.DECAY_INTERVAL_MS);
    this.logger.log(`NeedsScheduler started (interval: 15 min)`);
  }

  async decayAllPets(): Promise<void> {
    try {
      const pets = await this.petRepo.findAllActive();
      if (pets.length === 0) return;

      let changed = 0;
      for (const pet of pets) {
        const before = {
          hunger: pet.hunger.value,
          happiness: pet.happiness.value,
          energy: pet.energy.value,
          hygiene: pet.hygiene.value,
        };

        this.decayService.applyDecay(pet, pet.updatedAt);

        if (
          pet.hunger.value !== before.hunger ||
          pet.happiness.value !== before.happiness ||
          pet.energy.value !== before.energy ||
          pet.hygiene.value !== before.hygiene
        ) {
          await this.petRepo.update(pet);
          changed++;
          this.wsNotifier.notifyPetState(pet.id.value, {
            hunger: pet.hunger.value,
            happiness: pet.happiness.value,
            energy: pet.energy.value,
            hygiene: pet.hygiene.value,
            mood: pet.mood,
          });
        }
      }

      if (changed > 0) {
        this.logger.log(`Decay applied to ${changed}/${pets.length} pets`);
      }
    } catch (err) {
      this.logger.error('Error in needs decay cycle', err);
    }
  }
}
