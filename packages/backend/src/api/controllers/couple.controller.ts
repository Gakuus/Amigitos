import {
  Controller, Post, Get, Body, Param, UseGuards, Inject,
  NotFoundException, ConflictException, BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CoupleService } from '../../application/services/couple.service';
import { InvitePartnerDto } from '../dto/couple.dto';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { CurrentUser } from '../../infrastructure/auth/current-user.decorator';

@Controller('couples')
@UseGuards(JwtGuard)
export class CoupleController {
  constructor(
    @Inject('CoupleService') private readonly coupleService: CoupleService,
  ) {}

  @Post('invite')
  async invite(@Body() dto: InvitePartnerDto, @CurrentUser() user: { userId: string }) {
    try {
      const couple = await this.coupleService.invitePartner(user.userId, dto.userEmail);
      return couple.toJSON();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      throw this.toHttpException(message, {
        USER_NOT_FOUND: NotFoundException,
        PARTNER_NOT_FOUND: NotFoundException,
        USER_ALREADY_IN_COUPLE: ConflictException,
        PARTNER_ALREADY_IN_COUPLE: ConflictException,
        COUPLE_ALREADY_EXISTS: ConflictException,
      });
    }
  }

  @Post(':id/accept')
  async accept(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    try {
      const couple = await this.coupleService.acceptInvitation(id, user.userId);
      return couple.toJSON();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      throw this.toHttpException(message, {
        COUPLE_NOT_FOUND: NotFoundException,
        USER_NOT_FOUND: NotFoundException,
      });
    }
  }

  @Post(':id/dissolve')
  async dissolve(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    try {
      await this.coupleService.dissolveCouple(id, user.userId);
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      throw this.toHttpException(message, {
        COUPLE_NOT_FOUND: NotFoundException,
      });
    }
  }

  @Get('pending')
  async getPending(@CurrentUser() user: { userId: string }) {
    const couples = await this.coupleService.getPendingByUser(user.userId);
    return couples.map((c) => c.toJSON());
  }

  @Get('mine')
  async getMyCouple(@CurrentUser() user: { userId: string }) {
    const couple = await this.coupleService.getCoupleByUser(user.userId);
    if (!couple) {
      throw new NotFoundException('COUPLE_NOT_FOUND');
    }
    return couple.toJSON();
  }

  @Get(':id')
  async getCouple(@Param('id') id: string) {
    const couple = await this.coupleService.getCouple(id);
    if (!couple) {
      throw new NotFoundException('COUPLE_NOT_FOUND');
    }
    return couple.toJSON();
  }

  private toHttpException(
    message: string,
    map: Record<string, new (msg: string) => any>,
  ): never {
    const ExceptionClass = map[message];
    if (ExceptionClass) {
      throw new ExceptionClass(message);
    }
    throw new InternalServerErrorException(message);
  }
}
