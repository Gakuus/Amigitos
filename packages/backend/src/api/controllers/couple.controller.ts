import { Controller, Post, Get, Body, Param, UseGuards, Inject } from '@nestjs/common';
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
      const statusMap: Record<string, number> = {
        USER_NOT_FOUND: 404,
        PARTNER_NOT_FOUND: 404,
        USER_ALREADY_IN_COUPLE: 409,
        PARTNER_ALREADY_IN_COUPLE: 409,
        COUPLE_ALREADY_EXISTS: 409,
      };
      return { statusCode: statusMap[message] ?? 500, code: message };
    }
  }

  @Post(':id/accept')
  async accept(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    try {
      const couple = await this.coupleService.acceptInvitation(id, user.userId);
      return couple.toJSON();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      const statusMap: Record<string, number> = {
        COUPLE_NOT_FOUND: 404,
        USER_NOT_FOUND: 404,
      };
      return { statusCode: statusMap[message] ?? 500, code: message };
    }
  }

  @Post(':id/dissolve')
  async dissolve(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    try {
      await this.coupleService.dissolveCouple(id, user.userId);
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      return { statusCode: message === 'COUPLE_NOT_FOUND' ? 404 : 500, code: message };
    }
  }

  @Get(':id')
  async getCouple(@Param('id') id: string) {
    const couple = await this.coupleService.getCouple(id);
    if (!couple) {
      return { statusCode: 404, code: 'COUPLE_NOT_FOUND' };
    }
    return couple.toJSON();
  }

  @Get('mine')
  async getMyCouple(@CurrentUser() user: { userId: string }) {
    const couple = await this.coupleService.getCoupleByUser(user.userId);
    if (!couple) {
      return { statusCode: 404, code: 'COUPLE_NOT_FOUND' };
    }
    return couple.toJSON();
  }
}
