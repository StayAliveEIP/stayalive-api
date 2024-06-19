import {
  FaqSection,
  FaqSectionSchema,
} from '../../../../database/faq-section.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FaqSection.name, schema: FaqSectionSchema },
    ]),
  ],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}
