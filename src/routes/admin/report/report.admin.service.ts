import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportBug } from '../../../database/reportBug.schema';
import { Model, Types } from 'mongoose';
import {
  BugReportAdminResponse,
  BugReportUserAdminResponse,
  FeedbackReportAdminResponse,
} from './report.admin.dto';
import { SuccessMessage } from '../../../dto.dto';
import { AmazonS3Service } from '../../../services/s3/s3.service';
import { ReportFeedback } from '../../../database/reportFeedback.schema';

@Injectable()
export class ReportAdminService {
  private readonly log: Logger = new Logger(ReportAdminService.name);

  constructor(
    @InjectModel(ReportBug.name) private reportBugModel: Model<ReportBug>,
    @InjectModel(ReportFeedback.name)
    private reportFeedbackModel: Model<ReportFeedback>,
  ) {}

  async getBug(): Promise<BugReportAdminResponse[]> {
    this.log.debug('Fetching all bug reports');
    const reports = await this.reportBugModel.aggregate([
      {
        $lookup: {
          from: 'rescuers',
          localField: 'rescuerId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ]);
    const result: BugReportAdminResponse[] = [];
    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      const user: BugReportUserAdminResponse = {
        email: report.user.email.email,
        firstname: report.user.firstname,
        lastname: report.user.lastname,
        id: report.user._id,
        profilePictureUrl: report.user.profilePictureUrl || null,
      };
      const objectId = new Types.ObjectId(report._id);
      const createdAt = objectId.getTimestamp();
      result.push({
        createdAt: createdAt.toISOString(),
        pictureUrls: report.pictureUrls,
        id: report._id,
        message: report.message,
        user: user,
        level: report.level,
        isResolved: report.resolved,
      });
    }
    return result;
  }

  async getBugById(id: string): Promise<BugReportAdminResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The id is not a valid ObjectId');
    }
    const reports = await this.reportBugModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'rescuers',
          localField: 'rescuerId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ]);
    if (reports.length == 0) {
      throw new NotFoundException('The bug report does not exist');
    }
    const report = reports[0];
    const user: BugReportUserAdminResponse = {
      email: report.user.email.email,
      firstname: report.user.firstname,
      lastname: report.user.lastname,
      id: report.user._id,
      profilePictureUrl: report.user.profilePictureUrl || null,
    };
    const objectId = new Types.ObjectId(report._id);
    const createdAt = objectId.getTimestamp();
    return {
      createdAt: createdAt.toISOString(),
      pictureUrls: report.pictureUrls,
      id: report._id,
      message: report.message,
      user: user,
      level: report.level,
      isResolved: report.resolved,
    };
  }

  async deleteBug(id: string): Promise<SuccessMessage> {
    const report = await this.reportBugModel.findOneAndDelete({
      _id: id,
    });
    if (!report) {
      throw new NotFoundException('The bug report does not exist');
    }
    const s3 = AmazonS3Service.getInstance();
    const fileUrls = report.pictureUrls;
    for (let i = 0; i < fileUrls.length; i++) {
      const url = fileUrls[i];
      // Delete the file from S3
      const tag = url.split('/');
      const key = tag[tag.length - 1];
      await s3.deleteFile(key);
    }
    return {
      message: 'The bug report has been deleted',
    };
  }

  async resolveBug(id: string): Promise<SuccessMessage> {
    const report = await this.reportBugModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!report) {
      throw new NotFoundException('The bug report does not exist');
    }
    report.resolved = !report.resolved;
    await report.save();
    if (report.resolved) {
      return {
        message: 'The bug report has been marked as resolved',
      };
    }
    return {
      message: 'The bug report has been marked as unresolved',
    };
  }

  async changeLevel(id: string, level: string): Promise<SuccessMessage> {
    const report = await this.reportBugModel.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!report) {
      throw new NotFoundException('The bug report does not exist');
    }
    if (isNaN(Number(level))) {
      throw new NotFoundException('The level must be an integer');
    }
    const newLevel = Number.parseInt(level, 10);
    if (newLevel < 1 || newLevel > 3) {
      throw new NotFoundException('The level must be between 1 and 3');
    }
    report.level = newLevel;
    await report.save();
    return {
      message: 'The level of the bug report has been changed',
    };
  }

  async getFeedback(id: string): Promise<FeedbackReportAdminResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('The id is not a valid ObjectId');
    }
    const reports = await this.reportFeedbackModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'rescuers',
          localField: 'rescuerId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ]);
    if (reports.length == 0) {
      throw new NotFoundException('The feedback does not exist');
    }
    const report = reports[0];
    const user: BugReportUserAdminResponse = {
      email: report.user.email.email,
      firstname: report.user.firstname,
      lastname: report.user.lastname,
      id: report.user._id,
      profilePictureUrl: report.user.profilePictureUrl || null,
    };
    const objectId = new Types.ObjectId(report._id);
    const createdAt = objectId.getTimestamp();
    return {
      createdAt: createdAt.toISOString(),
      id: report._id,
      user: user,
      rating: report.rating,
      goodPoints: report.goodPoints,
      badPoints: report.badPoints,
      ideaAndSuggestions: report.ideaAndSuggestions,
    };
  }

  async getFeedbacks(): Promise<FeedbackReportAdminResponse[]> {
    this.log.debug('Fetching all feedback reports');
    const reports = await this.reportFeedbackModel.aggregate([
      {
        $lookup: {
          from: 'rescuers',
          localField: 'rescuerId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ]);
    const result: FeedbackReportAdminResponse[] = [];
    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      const user: BugReportUserAdminResponse = {
        email: report.user.email.email,
        firstname: report.user.firstname,
        lastname: report.user.lastname,
        id: report.user._id,
        profilePictureUrl: report.user.profilePictureUrl || null,
      };
      const objectId = new Types.ObjectId(report._id);
      const createdAt = objectId.getTimestamp();
      result.push({
        createdAt: createdAt.toISOString(),
        id: report._id,
        user: user,
        rating: report.rating,
        goodPoints: report.goodPoints,
        badPoints: report.badPoints,
        ideaAndSuggestions: report.ideaAndSuggestions,
      });
    }
    return result;
  }
}
