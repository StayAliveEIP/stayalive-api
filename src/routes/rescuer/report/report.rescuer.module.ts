import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { ReportRescuerController } from './report.rescuer.controller';
import { ReportBug, ReportBugSchema } from '../../../database/reportBug.schema';
import { ReportRescuerService } from './report.rescuer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReportBug.name, schema: ReportBugSchema },
    ]),
  ],
  controllers: [ReportRescuerController],
  providers: [JwtStrategy, ReportRescuerService],
})
export class ReportRescuerModule {}
