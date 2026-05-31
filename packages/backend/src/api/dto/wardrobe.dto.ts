import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ClothingSlot } from '../../domain/wardrobe/wardrobe-item.entity';

export class EquipItemDto {
  @IsString()
  itemId!: string;
}

export class UnequipItemDto {
  @IsEnum(ClothingSlot)
  slot!: ClothingSlot;
}

export class WardrobeQueryDto {
  @IsString()
  @IsOptional()
  species?: string;
}
