import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportBug } from '../../../database/reportBug.schema';
import { Model, Types } from 'mongoose';
import {
  BugReportAdminResponse,
  BugReportUserAdminResponse,
} from './report.admin.dto';
import { Rescuer } from '../../../database/rescuer.schema';
import { SuccessMessage } from '../../../dto.dto';
import { AmazonS3Service } from '../../../services/s3/s3.service';

@Injectable()
export class ReportAdminService {
  private readonly log: Logger = new Logger(ReportAdminService.name);

  constructor(
    @InjectModel(ReportBug.name) private reportBugModel: Model<ReportBug>,
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
}
