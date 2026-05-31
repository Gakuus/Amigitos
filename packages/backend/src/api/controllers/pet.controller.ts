import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Inject,
} from '@nestjs/common';
import { PetService } from '../../application/services/pet.service';
import { AdoptPetDto, UpdatePetDto } from '../dto/pet.dto';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { CurrentUser } from '../../infrastructure/auth/current-user.decorator';
import { PetSpecies } from '../../domain/pet/pet-species';
import { PrismaUserRepository } from '../../infrastructure/persistence/prisma-user.repository';

@Controller('pets')
@UseGuards(JwtGuard)
export class PetController {
  constructor(
    @Inject('PetService') private readonly petService: PetService,
    private readonly userRepo: PrismaUserRepository,
  ) {}

  @Post('adopt')
  async adopt(@Body() dto: AdoptPetDto, @CurrentUser() user: { userId: string }) {
    const userEntity = await this.userRepo.findById(user.userId);
    const pet = await this.petService.adoptPet(
      dto.name,
      dto.species as PetSpecies,
      userEntity?.coupleId ?? undefined,
    );
    return pet.toJSON();
  }

  @Get(':id')
  async getPet(@Param('id') id: string) {
    const pet = await this.petService.getPet(id);
    if (!pet) {
      return { statusCode: 404, code: 'PET_NOT_FOUND', message: 'Pet not found' };
    }
    return pet.toJSON();
  }

  @Patch(':id')
  async updatePet(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    const pet = await this.petService.getPet(id);
    if (!pet) {
      return { statusCode: 404, code: 'PET_NOT_FOUND', message: 'Pet not found' };
    }
    if (dto.name) {
      pet.rename(dto.name);
    }
    return pet.toJSON();
  }

  @Post(':id/feed')
  async feed(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    try {
      const pet = await this.petService.feedPet(id, user.userId);
      return pet.toJSON();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      return this.handlePetError(message);
    }
  }

  @Post(':id/play')
  async play(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    try {
      const pet = await this.petService.playWithPet(id, user.userId);
      return pet.toJSON();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      return this.handlePetError(message);
    }
  }

  @Post(':id/bathe')
  async bathe(@Param('id') id: string, @CurrentUser() user: { userId: string }) {
    try {
      const pet = await this.petService.bathePet(id, user.userId);
      return pet.toJSON();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      return this.handlePetError(message);
    }
  }

  @Post(':id/sleep')
  async sleep(@Param('id') id: string) {
    try {
      const pet = await this.petService.putPetToSleep(id);
      return pet.toJSON();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      return this.handlePetError(message);
    }
  }

  @Post(':id/wake')
  async wake(@Param('id') id: string) {
    try {
      const pet = await this.petService.wakePet(id);
      return pet.toJSON();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'UNKNOWN';
      return this.handlePetError(message);
    }
  }

  @Get('couple/:coupleId')
  async getByCouple(@Param('coupleId') coupleId: string) {
    const pets = await this.petService.getPetsByCouple(coupleId);
    return pets.map((p) => p.toJSON());
  }

  private handlePetError(message: string) {
    const statusMap: Record<string, number> = {
      PET_NOT_FOUND: 404,
      PET_IS_SLEEPING: 409,
      NOT_ENOUGH_ENERGY: 409,
      COOLDOWN_ACTIVE: 429,
    };
    const status = statusMap[message] ?? 500;
    return { statusCode: status, code: message };
  }
}
