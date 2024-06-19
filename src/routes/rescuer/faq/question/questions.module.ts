import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FaqQuestion,
  FaqQuestionSchema,
} from '../../../../database/faq-question.schema';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FaqQuestion.name, schema: FaqQuestionSchema },
    ]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
