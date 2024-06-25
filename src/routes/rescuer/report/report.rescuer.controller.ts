import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RescuerAuthGuard } from '../../../guards/auth.route.guard';
import { ReportRescuerService } from './report.rescuer.service';
import { UserId } from '../../../decorator/userid.decorator';
import { SuccessMessage } from '../../../dto.dto';
import { Types } from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FeedbackAnswerRequest, ReportBugRequest } from './report.rescuer.dto';

@ApiBearerAuth()
@ApiTags('Report')
@Controller('/rescuer/report')
export class ReportRescuerController {
  constructor(private readonly service: ReportRescuerService) {}

  @Post('/bug')
  @UseGuards(RescuerAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The bug report',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The message of the bug report',
        },
        file: {
          type: 'file',
          description:
            'The picture to attach to the bug report. You can send 5 pictures at most.',
        },
        level: {
          type: 'string',
          description: 'The level of the bug, between 1 and 3.',
          example: 1,
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Send a bug report',
    description:
      'Send a bug report to the developers, you can attach a file to help them understand the problem. The number of files is limited to 5 and the size of each file is limited to 10Mo.',
  })
  @ApiResponse({
    status: 200,
    description: 'The bug report has been sent',
    type: SuccessMessage,
  })
  @UseInterceptors(FilesInterceptor('file', 5))
  async reportBug(
    @UserId() userId: Types.ObjectId,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '(jpg|jpeg|png)$', // Regex to valid only pdf, jpeg, jpg or png
        })
        .addMaxSizeValidator({
          maxSize: 1010000000, // 1OMo
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Array<Express.Multer.File>,
    @Body() body: ReportBugRequest,
  ): Promise<SuccessMessage> {
    return this.service.reportBug(userId, file, body);
  }

  @Post('/feedback')
  @UseGuards(RescuerAuthGuard)
  @ApiOperation({
    summary: 'Send feedback',
    description: 'Send feedback to the developers.',
  })
  @ApiResponse({
    status: 200,
    description: 'You feedback has been sent',
    type: SuccessMessage,
    isArray: true,
  })
  async sendFeedback(
    @UserId() userId: Types.ObjectId,
    @Body() body: FeedbackAnswerRequest,
  ): Promise<SuccessMessage> {
    return this.service.sendFeedback(userId, body);
  }
}
