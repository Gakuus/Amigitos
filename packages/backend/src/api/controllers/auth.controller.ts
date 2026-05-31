import {
  Controller, Post, Get, Body, HttpCode, HttpStatus, Inject, UseGuards,
  ConflictException, UnauthorizedException, NotFoundException,
} from '@nestjs/common';
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
    const result = await this.authService.register(dto.email, dto.name, dto.password).catch((error: Error) => {
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        throw new ConflictException('Email already registered');
      }
      throw error;
    });
    return { user: result.user.toJSON(), ...result.tokens };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto.email, dto.password).catch((error: Error) => {
      if (error.message === 'INVALID_CREDENTIALS') {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    });
    return { user: result.user.toJSON(), ...result.tokens };
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
      throw new NotFoundException('User not found');
    }
    return userEntity.toJSON();
  }
}
