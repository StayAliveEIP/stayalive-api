import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { ReportBug, ReportBugSchema } from '../../../database/reportBug.schema';
import { ReportAdminController } from './report.admin.controller';
import { ReportAdminService } from './report.admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportBug.name, schema: ReportBugSchema },
    ]),
  ],
  controllers: [ReportAdminController],
  providers: [JwtStrategy, ReportAdminService],
})
export class ReportAdminModule {}
