import { Controller, Post, Get, Body, HttpCode, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from '../dto/auth.dto';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { CurrentUser } from '../../infrastructure/auth/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const result = await this.authService.register(dto.email, dto.name, dto.password);
      return { user: result.user.toJSON(), ...result.tokens };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'REGISTRATION_FAILED';
      if (message === 'EMAIL_ALREADY_EXISTS') {
        return { statusCode: 409, code: message, message: 'Email already registered' };
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    try {
      const result = await this.authService.login(dto.email, dto.password);
      return { user: result.user.toJSON(), ...result.tokens };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'LOGIN_FAILED';
      if (message === 'INVALID_CREDENTIALS') {
        return { statusCode: 401, code: message, message: 'Invalid credentials' };
      }
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    const tokens = this.authService.refreshToken(dto.refreshToken);
    return tokens;
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@CurrentUser() user: { userId: string }) {
    const userEntity = await this.authService.validateUser(user.userId);
    if (!userEntity) {
      return { statusCode: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }
    return userEntity.toJSON();
  }
}
