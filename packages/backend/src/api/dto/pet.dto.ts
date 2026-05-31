import { IsString, IsEnum, MinLength, MaxLength, IsOptional } from 'class-validator';
import { PetSpecies } from '@amigitos/shared';

export class AdoptPetDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name!: string;

  @IsEnum(PetSpecies)
  species!: PetSpecies;
}

export class UpdatePetDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsOptional()
  name?: string;
}
