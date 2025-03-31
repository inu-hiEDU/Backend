import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucket: string;
  private region: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.mustGetEnv('AWS_REGION'),
      credentials: {
        accessKeyId: this.mustGetEnv('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.mustGetEnv('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.bucket = this.mustGetEnv('AWS_S3_BUCKET_NAME');
    this.region = this.mustGetEnv('AWS_REGION');
  }

  async uploadFileToS3(file: Express.Multer.File) {
    const fileKey = `images/${uuidv4()}-${file.originalname}`;

    const params = {
      Bucket: this.bucket,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.send(new PutObjectCommand(params));

    const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;

    return { url };
  }

  private mustGetEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }
}
