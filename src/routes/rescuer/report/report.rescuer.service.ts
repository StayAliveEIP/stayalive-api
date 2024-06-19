import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReportBug } from '../../../database/reportBug.schema';
import { SuccessMessage } from '../../../dto.dto';
import {
  FeedbackQuestionResponse,
  ReportBugRequest,
} from './report.rescuer.dto';
import { AmazonS3Service } from '../../../services/s3/s3.service';
import * as url from 'node:url';

@Injectable()
export class ReportRescuerService {
  private readonly log: Logger = new Logger(ReportRescuerService.name);

  constructor(
    @InjectModel(ReportBug.name) private reportBugModel: Model<ReportBug>,
  ) {}

  async reportBug(
    userId: Types.ObjectId,
    files: Array<Express.Multer.File>,
    body: ReportBugRequest,
  ): Promise<SuccessMessage> {
    const level = Number.parseInt(body.level, 10);
    this.log.log(`Level of the bug report: ${level}`);
    if (isNaN(level)) {
      throw new BadRequestException(
        'The level of the bug report must be an integer',
      );
    }
    if (level < 1 || level > 3) {
      throw new BadRequestException(
        'The level of the bug report must be between 1 and 3',
      );
    }
    if (files.length == 0) {
      throw new BadRequestException('A file is required to send a bug report.');
    }
    const s3 = AmazonS3Service.getInstance();
    this.log.debug('Uploading file to S3...');
    const fileUrls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uuid = new Types.ObjectId();
      const key = `bug-report/${uuid}`;
      const contentType: string = file.mimetype;
      const s3response = await s3.uploadFile(key, file.buffer, contentType);
      fileUrls.push(s3response.url);
      this.log.debug(`File uploaded to S3: ${s3response.url}`);
    }
    this.log.debug(
      `${files.length} file(s) uploaded to Amazon S3 for rescuer bug report`,
    );
    const report = new this.reportBugModel({
      rescuerId: userId,
      message: body.message,
      pictureUrls: fileUrls,
      level: level,
      resolved: false,
    });
    await report.save();
    this.log.debug('Bug report saved in database');
    return {
      message: 'The bug report has been sent',
    };
  }

  async getFeedbackQuestion(): Promise<FeedbackQuestionResponse[]> {
    return [
      {
        question: 'How do you rate the application?',
      },
    ];
  }
}
