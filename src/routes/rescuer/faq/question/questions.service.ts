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
    const result = await this.helpQuestionModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: 'FaqSubsections',
          localField: 'subsection',
          foreignField: '_id',
          as: 'subsection',
        },
      },
      {
        $unwind: {
          path: '$subsection',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'FaqSections',
          localField: 'subsection.section',
          foreignField: '_id',
          as: 'subsection.section',
        },
      },
      {
        $unwind: {
          path: '$subsection.section',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'FaqQuestions',
          localField: 'subsection._id',
          foreignField: 'subsection',
          as: 'subsectionQuestions',
        },
      },
      {
        $unwind: {
          path: '$subsectionQuestions',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unset: [
          'subsectionQuestions.subsection',
          'subsectionQuestions.answer',
          'subsectionQuestions.author',
          'subsectionQuestions.edited',
          'subsectionQuestions.created',
        ],
      },
      {
        $group: {
          _id: '$_id',
          question: {
            $first: '$question',
          },
          answer: {
            $first: '$answer',
          },
          subsection: {
            $first: '$subsection',
          },
          author: {
            $first: '$author',
          },
          edited: {
            $first: '$edited',
          },
          created: {
            $first: '$created',
          },
          subsectionQuestions: {
            $addToSet: '$subsectionQuestions',
          },
        },
      },
      {
        $project: {
          _id: '$_id',
          question: '$question',
          answer: '$answer',
          author: '$author',
          subsection: {
            _id: '$subsection._id',
            title: '$subsection.title',
            description: '$subsection.description',
            section: '$subsection.section',
            questions: {
              $sortArray: {
                input: '$subsectionQuestions',
                sortBy: {
                  question: 1,
                },
              },
            },
          },
          created: '$created',
          edited: '$edited',
        },
      },
      {
        $group: {
          _id: '$_id',
          question: {
            $first: '$question',
          },
          answer: {
            $first: '$answer',
          },
          subsection: {
            $first: '$subsection',
          },
          author: {
            $first: '$author',
          },
          edited: {
            $first: '$edited',
          },
          created: {
            $first: '$created',
          },
        },
      },
    ]);
    if (!result) {
      throw new HttpException('Aucune question trouvée', 404);
    }
    return result[0];
  }
}
