import { Couple } from '../../domain/couple/couple.entity';

export interface CoupleRepositoryPort {
  findById(id: string): Promise<Couple | null>;
  findByUserId(userId: string): Promise<Couple | null>;
  save(couple: Couple): Promise<void>;
  update(couple: Couple): Promise<void>;
  delete(id: string): Promise<void>;
}
