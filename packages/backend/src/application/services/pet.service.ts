import { Pet, InteractionType } from '../../domain/pet/pet.entity';
import { PetId } from '../../domain/pet/pet-id.value-object';
import { PetSpecies } from '../../domain/pet/pet-species';
import { PetRepositoryPort } from '../ports/pet-repository.port';
import { WebSocketNotifierPort } from '../ports/websocket-notifier.port';
import { DecayService } from '../../domain/services/decay.service';
import { PetFedEvent, PetPlayedEvent, PetBathedEvent, PetSleptEvent, PetEvolvedEvent, PetMoodChangedEvent } from '../../domain/pet/pet.domain-events';
import { MAX_PETS_PER_COUPLE } from '@amigitos/shared';

export class PetService {
  private readonly decayService = new DecayService();

  constructor(
    private readonly petRepo: PetRepositoryPort,
    private readonly wsNotifier: WebSocketNotifierPort,
  ) {}

  async adoptPet(name: string, species: PetSpecies, userId: string, coupleId?: string): Promise<Pet> {
    const count = await this.petRepo.countByUserOrCouple(userId, coupleId);
    if (count >= MAX_PETS_PER_COUPLE) {
      throw new Error('MAX_PETS_REACHED');
    }

    const pet = new Pet({
      id: PetId.create(),
      name,
      species,
      userId,
      coupleId,
    });
    await this.petRepo.save(pet);
    return pet;
  }

  async getPet(petId: string): Promise<Pet | null> {
    const pet = await this.petRepo.findById(petId);
    if (!pet) return null;

    this.decayService.applyDecay(pet, pet.updatedAt);
    await this.petRepo.update(pet);
    return pet;
  }

  async feedPet(petId: string, userId: string): Promise<Pet> {
    const pet = await this.petRepo.findById(petId);
    if (!pet) throw new Error('PET_NOT_FOUND');

    const canInteract = pet.canInteract('FEED');
    if (!canInteract.success) {
      throw new Error(canInteract.reason);
    }

    const oldMood = pet.mood;
    pet.feed();
    await this.petRepo.update(pet);

    this.wsNotifier.notifyPetFed(petId, userId, pet.hunger.value);
    this.wsNotifier.notifyPetState(petId, {
      hunger: pet.hunger.value,
      happiness: pet.happiness.value,
      energy: pet.energy.value,
      hygiene: pet.hygiene.value,
      mood: pet.mood,
    });
    this.wsNotifier.notifyPartnerAction(userId, 'FEED', petId);

    if (pet.mood !== oldMood) {
      this.wsNotifier.notifyPetMoodChange(petId, oldMood, pet.mood);
    }

    return pet;
  }

  async playWithPet(petId: string, userId: string): Promise<Pet> {
    const pet = await this.petRepo.findById(petId);
    if (!pet) throw new Error('PET_NOT_FOUND');

    const canInteract = pet.canInteract('PLAY');
    if (!canInteract.success) {
      throw new Error(canInteract.reason);
    }

    const oldMood = pet.mood;
    pet.play();
    await this.petRepo.update(pet);

    this.wsNotifier.notifyPetPlayed(petId, userId, pet.happiness.value);
    this.wsNotifier.notifyPetState(petId, {
      hunger: pet.hunger.value,
      happiness: pet.happiness.value,
      energy: pet.energy.value,
      hygiene: pet.hygiene.value,
      mood: pet.mood,
    });
    this.wsNotifier.notifyPartnerAction(userId, 'PLAY', petId);

    if (pet.mood !== oldMood) {
      this.wsNotifier.notifyPetMoodChange(petId, oldMood, pet.mood);
    }

    return pet;
  }

  async bathePet(petId: string, userId: string): Promise<Pet> {
    const pet = await this.petRepo.findById(petId);
    if (!pet) throw new Error('PET_NOT_FOUND');

    const canInteract = pet.canInteract('BATH');
    if (!canInteract.success) {
      throw new Error(canInteract.reason);
    }

    const oldMood = pet.mood;
    pet.bathe();
    await this.petRepo.update(pet);

    this.wsNotifier.notifyPetBathed(petId, userId, pet.hygiene.value);
    this.wsNotifier.notifyPetState(petId, {
      hunger: pet.hunger.value,
      happiness: pet.happiness.value,
      energy: pet.energy.value,
      hygiene: pet.hygiene.value,
      mood: pet.mood,
    });
    this.wsNotifier.notifyPartnerAction(userId, 'BATH', petId);

    if (pet.mood !== oldMood) {
      this.wsNotifier.notifyPetMoodChange(petId, oldMood, pet.mood);
    }

    return pet;
  }

  async putPetToSleep(petId: string): Promise<Pet> {
    const pet = await this.petRepo.findById(petId);
    if (!pet) throw new Error('PET_NOT_FOUND');

    pet.sleep();
    await this.petRepo.update(pet);

    this.wsNotifier.notifyPetState(petId, {
      hunger: pet.hunger.value,
      happiness: pet.happiness.value,
      energy: pet.energy.value,
      hygiene: pet.hygiene.value,
      isSleeping: true,
    });

    return pet;
  }

  async wakePet(petId: string): Promise<Pet> {
    const pet = await this.petRepo.findById(petId);
    if (!pet) throw new Error('PET_NOT_FOUND');

    pet.wakeUp();
    await this.petRepo.update(pet);

    this.wsNotifier.notifyPetState(petId, {
      hunger: pet.hunger.value,
      happiness: pet.happiness.value,
      energy: pet.energy.value,
      hygiene: pet.hygiene.value,
      isSleeping: false,
    });

    return pet;
  }

  async setModel(petId: string, modelUrl: string, thumbnail?: string): Promise<Pet> {
    const pet = await this.petRepo.findById(petId);
    if (!pet) throw new Error('PET_NOT_FOUND');

    pet.setModelUrl(modelUrl);
    if (thumbnail) {
      pet.setThumbnail(thumbnail);
    }
    await this.petRepo.update(pet);
    return pet;
  }

  async getPetsByCouple(coupleId: string): Promise<Pet[]> {
    return this.petRepo.findByCoupleId(coupleId);
  }

  async getMyPets(userId: string): Promise<Pet[]> {
    return this.petRepo.findByUserId(userId);
  }
}
