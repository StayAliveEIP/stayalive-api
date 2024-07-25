import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubsectionService } from './subsection.service';
import { SubsectionController } from './subsection.controller';
import {
  FaqSubsection,
  FaqSubsectionSchema,
} from '../../../../database/faq-subsection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FaqSubsection.name, schema: FaqSubsectionSchema },
    ]),
  ],
  controllers: [SubsectionController],
  providers: [SubsectionService],
})
export class FaqRescuerSubsectionModule {}
