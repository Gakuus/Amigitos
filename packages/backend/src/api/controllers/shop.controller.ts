import {
  Controller, Get, Post, Param, UseGuards, Body,
  NotFoundException, BadRequestException,
} from '@nestjs/common';
import { ShopService } from '../../application/services/shop.service';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { CurrentUser } from '../../infrastructure/auth/current-user.decorator';

@Controller('shop')
@UseGuards(JwtGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('items')
  async getItems() {
    return this.shopService.getShopItems();
  }

  @Post('buy/:itemType/:itemId')
  async buy(
    @Param('itemType') itemType: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user: { userId: string },
  ) {
    try {
      return await this.shopService.buyItem(user.userId, itemType, itemId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'INSUFFICIENT_COINS') {
          throw new BadRequestException('Not enough coins');
        }
      }
      throw error;
    }
  }

  @Get('inventory')
  async inventory(@CurrentUser() user: { userId: string }) {
    return this.shopService.getInventory(user.userId);
  }

  @Get('balance')
  async balance(@CurrentUser() user: { userId: string }) {
    return this.shopService.getBalance(user.userId);
  }

  @Post('use/:itemId')
  async useItem(
    @Param('itemId') itemId: string,
    @Body() body: { petId: string },
    @CurrentUser() user: { userId: string },
  ) {
    try {
      return await this.shopService.useConsumableOnPet(user.userId, body.petId, itemId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw error;
    }
  }
}
