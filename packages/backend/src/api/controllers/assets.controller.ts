import {
  Controller, Get, Post, Delete, Param, UseGuards, Inject,
  NotFoundException, StreamableFile,
} from '@nestjs/common';
import { MinioService } from '../../infrastructure/storage/minio.service';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';

@Controller('assets')
export class AssetsController {
  constructor(private readonly minio: MinioService) {}

  @Get('models/:key')
  async getModel(@Param('key') key: string) {
    const file = await this.minio.getFile(`models/${key}`);
    if (!file) throw new NotFoundException('Model not found');
    return new StreamableFile(file);
  }

  @Get('models')
  @UseGuards(JwtGuard)
  async listModels() {
    const files = await this.minio.listFiles('models/');
    return files.map((key) => ({
      key: key.replace('models/', ''),
      url: this.minio.getPublicUrl(key),
    }));
  }
}
