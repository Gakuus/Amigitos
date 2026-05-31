import { Module, Global } from '@nestjs/common';
import { MinioService } from '../infrastructure/storage/minio.service';

@Global()
@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class StorageModule {}
