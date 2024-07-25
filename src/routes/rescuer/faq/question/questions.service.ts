import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FaqQuestion } from '../../../../database/faq-question.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(FaqQuestion.name)
    private helpQuestionModel: Model<FaqQuestion>,
  ) {}

  async questionId(id: string) {
    const result = await this.helpQuestionModel.findById(id);
    if (!result) {
      throw new HttpException('Aucune question trouvée', 404);
    }
    return result;
  }
}
