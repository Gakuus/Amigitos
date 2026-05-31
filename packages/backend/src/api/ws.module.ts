import { Module } from '@nestjs/common';
import { PetGateway } from '../infrastructure/websockets/pet.gateway';

@Module({
  providers: [PetGateway],
  exports: [PetGateway],
})
export class WsModule {}
