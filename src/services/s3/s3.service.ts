import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class AmazonS3Service {
  private static instance: AmazonS3Service;
  private client: S3Client;
  private accessKey: string;
  private secretKey: string;
  private bucketName: string;
  constructor() {
    this.accessKey = process.env.AWS_ACCESS_KEY;
    this.secretKey = process.env.AWS_SECRET_KEY;
    this.bucketName = process.env.AWS_BUCKET_NAME;

    this.client = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  public static getInstance(): AmazonS3Service {
    if (!AmazonS3Service.instance) {
      AmazonS3Service.instance = new AmazonS3Service();
    }
    return AmazonS3Service.instance;
  }

  public async listObjects() {
    const command = new ListObjectsCommand({ Bucket: this.bucketName });
    const response = await this.client.send(command);
    return response.Contents;
  }

  public async uploadFile(key: string, body: any) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ACL: 'public-read',
    });
    const response = await this.client.send(command);
    return {
      ...response,
      url: `https://${this.bucketName}.s3.amazonaws.com/${key}`,
    };
  }

  // Method to delete a file from the bucket
  public async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await this.client.send(command);
  }
}
