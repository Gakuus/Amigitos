import { Module } from '@nestjs/common';
import { ShopController } from './controllers/shop.controller';
import { ShopService } from '../application/services/shop.service';
import { PrismaModule } from '../infrastructure/persistence/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
