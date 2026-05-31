import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, Email, UserId } from '../../domain/user/user.entity';
import { UserRepositoryPort } from '../ports/user-repository.port';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret';

  constructor(private readonly userRepo: UserRepositoryPort) {}

  async register(email: string, name: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error('EMAIL_ALREADY_EXISTS');

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      id: UserId.create(),
      email: Email.create(email),
      name,
    });

    await this.userRepo.save(user);

    const tokens = this.generateTokens(user.id.value);
    return { user, tokens };
  }

  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const tokens = this.generateTokens(user.id.value);
    return { user, tokens };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepo.findById(userId);
  }

  private generateTokens(userId: string): AuthTokens {
    const accessToken = jwt.sign({ sub: userId }, this.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: userId }, this.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  verifyToken(token: string): { sub: string } {
    return jwt.verify(token, this.JWT_SECRET) as { sub: string };
  }

  refreshToken(refreshToken: string): AuthTokens {
    const payload = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as { sub: string };
    return this.generateTokens(payload.sub);
  }
}
