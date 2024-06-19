import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FaqQuestion } from '../../../database/faq-question.schema';
import { FaqSection } from '../../../database/faq-section.schema';
import { FaqSubsection } from '../../../database/faq-subsection.schema';

@Injectable()
export class FaqAdminService {
  constructor(
    @InjectModel(FaqQuestion.name) private questionModel: Model<FaqQuestion>,
    @InjectModel(FaqSection.name) private sectionModel: Model<FaqSection>,
    @InjectModel(FaqSubsection.name)
    private subsectionModel: Model<FaqSubsection>,
  ) {}

  async postSection(title: string, description: string) {
    const newSection = new this.sectionModel({
      title: title,
      description: description,
    });
    await newSection.save();
    return 'Section ajoutée avec succès';
  }

  async deleteSection(id: string) {
    const section = await this.sectionModel.findById(id);
    if (!section) {
      throw new HttpException('Section introuvable', 404);
    }
    const subsections = await this.subsectionModel.find({ section: id });
    for (let i = 0; i < subsections.length; i++) {
      const questions = await this.questionModel.find({
        subsection: subsections[i]._id,
      });
      for (let j = 0; j < questions.length; j++) {
        await this.questionModel.findByIdAndDelete(questions[j]._id);
      }
      await this.subsectionModel.findByIdAndDelete(subsections[i]);
    }
    await section.deleteOne();
    return 'Section supprimée avec succès';
  }

  async putSection(id: string, title: string, description: string) {
    const section = await this.sectionModel.findById(id);
    if (!section) {
      throw new HttpException('Section introuvable', 404);
    }
    section.title = title;
    section.description = description;
    await section.save();
    return 'Section modifiée avec succès';
  }

  async postSubsection(id: string, title: string, description: string) {
    const section = await this.sectionModel.findById(id);
    if (!section) {
      throw new HttpException('Section introuvable', 404);
    }
    const newSubsection = new this.subsectionModel({
      section: new Types.ObjectId(id),
      title: title,
      description: description,
    });
    await newSubsection.save();
    return 'Sous-section ajoutée avec succès';
  }

  async deleteSubsection(id: string) {
    const subsection = await this.subsectionModel.findById(id);
    if (!subsection) {
      throw new HttpException('Sous-section introuvable', 404);
    }
    const questions = await this.questionModel.find({ subsection: id });
    for (let i = 0; i < questions.length; i++) {
      await this.questionModel.findByIdAndDelete(questions[i]._id);
    }
    await subsection.deleteOne();
    return 'Sous-section supprimée avec succès';
  }

  async putSubsection(
    id: string,
    section: string,
    title: string,
    description: string,
  ) {
    const subsection = await this.subsectionModel.findById(id);
    if (!subsection) {
      throw new HttpException('Sous-section introuvable', 404);
    }
    subsection.section = new Types.ObjectId(section);
    subsection.title = title;
    subsection.description = description;
    await subsection.save();
    return 'Sous-section modifiée avec succès';
  }

  async postQuestion(id: string, question: string, answer: string) {
    const section = await this.subsectionModel.findById(id);
    if (!section) {
      throw new HttpException('SubSection introuvable', 404);
    }
    const newQuestion = new this.questionModel({
      subsection: new Types.ObjectId(id),
      question: question,
      answer: answer,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
    await newQuestion.save();
    return 'Question ajoutée avec succès';
  }

  async deleteQuestion(id: string) {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new HttpException('Question introuvable', 404);
    }
    await question.deleteOne();
    return 'Question supprimée avec succès';
  }

  async putQuestion(
    id: string,
    subsection: string,
    question: string,
    answer: string,
  ) {
    const questionObject = await this.questionModel.findById(id);
    if (!questionObject) {
      throw new HttpException('Question introuvable', 404);
    }
    questionObject.question = question;
    questionObject.answer = answer;
    questionObject.modifiedAt = new Date();
    await questionObject.save();
    return 'Question modifiée avec succès';
  }

  async getSectionDetails() {
    return this.sectionModel.aggregate([
      {
        $sort: {
          title: 1,
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
        $unwind: { path: '$subsections', preserveNullAndEmptyArrays: true },
      },
    ]);
  }
}
