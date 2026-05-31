import { Controller, Get, Post, Param, Body, Query, UseGuards, Inject } from '@nestjs/common';
import { WardrobeService } from '../../application/services/wardrobe.service';
import { EquipItemDto, UnequipItemDto, WardrobeQueryDto } from '../dto/wardrobe.dto';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { CurrentUser } from '../../infrastructure/auth/current-user.decorator';

@Controller()
@UseGuards(JwtGuard)
export class WardrobeController {
  constructor(
    @Inject('WardrobeService') private readonly wardrobeService: WardrobeService,
  ) {}

  @Get('wardrobe')
  async listItems(@Query() query: WardrobeQueryDto) {
    const items = await this.wardrobeService.getAvailableItems(query.species);
    return items.map((i) => i.toJSON());
  }

  @Get('wardrobe/:id')
  async getItem(@Param('id') id: string) {
    const item = await this.wardrobeService.getItem(id);
    if (!item) {
      return { statusCode: 404, code: 'ITEM_NOT_FOUND' };
    }
    return item.toJSON();
  }

  @Post('pets/:petId/equip')
  async equip(
    @Param('petId') petId: string,
    @Body() dto: EquipItemDto,
    @CurrentUser() user: { userId: string },
  ) {
    try {
      const outfit = await this.wardrobeService.equipItem(petId, dto.itemId);
      return outfit.toJSON();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      const statusMap: Record<string, number> = {
        PET_NOT_FOUND: 404,
        ITEM_NOT_FOUND: 404,
        ITEM_NOT_COMPATIBLE: 400,
      };
      return { statusCode: statusMap[message] ?? 500, code: message };
    }
  }

  @Post('pets/:petId/unequip')
  async unequip(
    @Param('petId') petId: string,
    @Body() dto: UnequipItemDto,
    @CurrentUser() user: { userId: string },
  ) {
    try {
      const outfit = await this.wardrobeService.unequipItem(petId, dto.slot);
      return outfit.toJSON();
    } catch (error: unknown) {
      return {
        statusCode: 500,
        code: error instanceof Error ? error.message : 'UNKNOWN',
      };
    }
  }

  @Get('pets/:petId/outfit')
  async getOutfit(@Param('petId') petId: string) {
    const outfit = await this.wardrobeService.getPetOutfit(petId);
    return outfit.toJSON();
  }
}
