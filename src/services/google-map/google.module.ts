import { Module } from '@nestjs/common';
import { GoogleApiService } from './google.service';

@Module({
  providers: [GoogleApiService],
  exports: [GoogleApiService],
})
export class GoogleApiModule {}
