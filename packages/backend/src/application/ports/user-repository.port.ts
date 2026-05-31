import { User } from '../../domain/user/user.entity';

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  savePasswordHash(userId: string, passwordHash: string): Promise<void>;
  getPasswordHash(userId: string): Promise<string | null>;
}
