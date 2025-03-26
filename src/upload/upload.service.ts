import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private s3: AWS.S3;
  private bucket: string;
  private region: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: configService.get<string>('AWS_REGION'),
    });

    this.bucket = this.mustGetEnv('AWS_S3_BUCKET_NAME');
    this.region = this.mustGetEnv('AWS_REGION');
  }

  async uploadFileToS3(file: Express.Multer.File) {
    const fileKey = `images/${uuidv4()}-${file.originalname}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read',
    };

    await this.s3.upload(params).promise();

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
