import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FaqSection } from '../../../../database/faq-section.schema';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(FaqSection.name) private helpSectionModel: Model<FaqSection>,
  ) {}
  async section() {
    return this.helpSectionModel.aggregate([
      {
        $sort: {
          title: 1,
        },
      },
    ]);
  }

  async sectionId(id: string) {
    const result = await this.helpSectionModel.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: 'FaqSubsections',
          localField: '_id',
          foreignField: 'section',
          as: 'subsections',
        },
      },
      {
        $unset: 'subsections.section',
      },
      {
        $unwind: {
          path: '$subsections',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'FaqQuestions',
          localField: 'subsections._id',
          foreignField: 'subsection',
          as: 'subsections.questions',
        },
      },
      {
        $unset: [
          'subsections.questions.answer',
          'subsections.questions.author',
          'subsections.questions.edited',
          'subsections.questions.created',
          'subsections.questions.subsection',
        ],
      },
      {
        $project: {
          _id: '$_id',
          title: '$title',
          description: '$description',
          subsections: '$subsections',
          subsectionQuestions: {
            $sortArray: {
              input: '$subsections.questions',
              sortBy: {
                question: 1,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: '$_id',
          title: '$title',
          description: '$description',
          subsections: {
            _id: '$subsections._id',
            title: '$subsections.title',
            description: '$subsections.description',
            questions: '$subsectionQuestions',
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          title: {
            $first: '$title',
          },
          description: {
            $first: '$description',
          },
          subsections: {
            $addToSet: '$subsections',
          },
        },
      },
      {
        $project: {
          _id: '$_id',
          title: '$title',
          description: '$description',
          subsections: {
            $sortArray: {
              input: '$subsections',
              sortBy: {
                title: 1,
              },
            },
          },
        },
      },
    ]);
    if (result.length === 0)
      throw new NotFoundException("Section d'aide introuvable.");
    return result[0];
  }
}
