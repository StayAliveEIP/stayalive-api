import { Module } from '@nestjs/common';
import { ReactEmailService } from './react-email.service';

@Module({
  imports: [ReactEmailService],
  providers: [ReactEmailService],
})
export class ReactEmailModule {}
