import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FaqQuestion,
  FaqQuestionSchema,
} from '../../../database/faq-question.schema';
import {
  FaqSection,
  FaqSectionSchema,
} from '../../../database/faq-section.schema';
import {
  FaqSubsection,
  FaqSubsectionSchema,
} from '../../../database/faq-subsection.schema';
import { FaqAdminController } from './faq.controller';
import { FaqAdminService } from './faq.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FaqQuestion.name, schema: FaqQuestionSchema },
      { name: FaqSection.name, schema: FaqSectionSchema },
      { name: FaqSubsection.name, schema: FaqSubsectionSchema },
    ]),
  ],
  controllers: [FaqAdminController],
  providers: [FaqAdminService],
})
export class FaqAdminModule {}
