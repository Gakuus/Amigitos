import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client!: S3Client;
  private readonly bucket = process.env.MINIO_BUCKET ?? 'amigitos-assets';
  private readonly endpoint = process.env.MINIO_ENDPOINT ?? 'http://localhost:9000';
  private readonly region = 'us-east-1';

  async onModuleInit() {
    this.client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'amigitos',
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'amigitos_dev',
      },
      forcePathStyle: true,
    });

    await this.ensureBucket();
  }

  private async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Bucket ${this.bucket} already exists`);
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Bucket ${this.bucket} created`);
    }
  }

  async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return `${this.endpoint}/${this.bucket}/${key}`;
  }

  async getFile(key: string): Promise<Readable | null> {
    try {
      const result = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return result.Body as Readable;
    } catch {
      return null;
    }
  }

  async listFiles(prefix?: string): Promise<string[]> {
    const result = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
      }),
    );
    return (result.Contents ?? []).map((obj) => obj.Key ?? '').filter(Boolean);
  }

  async deleteFile(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  getPublicUrl(key: string): string {
    return `${this.endpoint}/${this.bucket}/${key}`;
  }
}
