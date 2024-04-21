import { AmazonS3Service } from './s3.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [AmazonS3Service],
  exports: [AmazonS3Service],
})
export class AmazonS3Module {}
