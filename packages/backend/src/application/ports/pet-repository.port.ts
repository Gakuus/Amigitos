import { Pet } from '../../domain/pet/pet.entity';

export interface PetRepositoryPort {
  findById(id: string): Promise<Pet | null>;
  findByCoupleId(coupleId: string): Promise<Pet[]>;
  findByUserId(userId: string): Promise<Pet[]>;
  save(pet: Pet): Promise<void>;
  update(pet: Pet): Promise<void>;
  delete(id: string): Promise<void>;
}
