import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { ReportBug, ReportBugSchema } from '../../../database/reportBug.schema';
import { ReportAdminController } from './report.admin.controller';
import { ReportAdminService } from './report.admin.service';
import {
  ReportFeedback,
  ReportFeedbackSchema,
} from '../../../database/reportFeedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportBug.name, schema: ReportBugSchema },
      { name: ReportFeedback.name, schema: ReportFeedbackSchema },
    ]),
  ],
  controllers: [ReportAdminController],
  providers: [JwtStrategy, ReportAdminService],
})
export class ReportAdminModule {}
