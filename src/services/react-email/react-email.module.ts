import { Module } from '@nestjs/common';
import { ReactEmailService } from './react-email.service';

@Module({
  exports: [ReactEmailService],
  providers: [ReactEmailService],
})
export class ReactEmailModule {}
