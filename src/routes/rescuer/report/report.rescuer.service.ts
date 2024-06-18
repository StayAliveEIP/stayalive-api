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
      const url = await s3.uploadFile(key, file.buffer, contentType);
      fileUrls.push(url);
    }
    this.log.debug(
      `${files.length} file(s) uploaded to Amazon S3 for rescuer bug report`,
    );
    const report = new this.reportBugModel({
      userId: userId,
      description: body.message,
      files: fileUrls,
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
