import {
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Res,
  StreamableFile,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { RescuerAuthGuard } from '../../../guards/auth.route.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentInformation, DocumentInformationAll } from './document.dto';
import type { Response } from 'express';
import { SuccessMessage } from '../../../dto.dto';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';

@Controller('/rescuer')
@ApiTags('Document')
@ApiBearerAuth()
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  @UseGuards(RescuerAuthGuard)
  @Get('/document')
  @ApiOperation({
    summary:
      'Get information about the document uploaded for the type given in the query.',
  })
  @ApiResponse({
    status: 404,
    description: 'If the document was never uploaded on the server.',
  })
  @ApiResponse({
    status: 200,
    type: DocumentInformation,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If your type of document is not valid',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    required: true,
  })
  async documentInformation(
    @UserId() userId: Types.ObjectId,
    @Query('type') type: string,
  ): Promise<DocumentInformation> {
    return this.service.documentInformation(userId, type);
  }

  @UseGuards(RescuerAuthGuard)
  @Get('/document/all')
  @ApiOperation({
    summary: 'Get information about all the documents uploaded.',
  })
  @ApiResponse({
    status: 200,
    type: DocumentInformationAll,
    isArray: true,
  })
  async documentInformationAll(
    @UserId() userId: Types.ObjectId,
  ): Promise<Array<DocumentInformationAll>> {
    return this.service.documentInformationAll(userId);
  }

  @ApiOperation({
    summary: 'Delete a document of the type given in the query',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessMessage,
    description:
      'When you file was successfully download or replaced for verification.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If your type of document is not valid',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'If the file was not previously uploaded by the rescuer.',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    required: true,
  })
  @UseGuards(RescuerAuthGuard)
  @Delete('/document')
  async delete(
    @UserId() userId: Types.ObjectId,
    @Query('type') type: string,
  ): Promise<SuccessMessage> {
    return this.service.delete(userId, type);
  }

  @ApiOperation({
    summary: 'Upload or replace your document for the type given in query.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessMessage,
    description:
      'When you file was successfully uploaded or replaced for verification.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If your type of document is not valid',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description:
      'If the file not respect the following format: pdf, jpg, jpeg or png or are bigger than 10 Mo.',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    required: true,
  })
  @UseGuards(RescuerAuthGuard)
  @Post('/document/upload')
  @UseInterceptors(FilesInterceptor('file', 1))
  async upload(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '(pdf|jpg|jpeg|png)$', // Regex to valid only pdf, jpeg, jpg or png
        })
        .addMaxSizeValidator({
          maxSize: 1010000000, // 1OMo
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Array<Express.Multer.File>,
    @UserId() userId: Types.ObjectId,
    @Query('type') type: string,
  ): Promise<SuccessMessage> {
    return this.service.upload(userId, type, file);
  }

  @ApiOperation({
    summary: 'Download your document for the type given in query.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessMessage,
    description:
      'When you file was successfully download or replaced for verification.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If your type of document is not valid',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'If the file was not previously uploaded by the rescuer.',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    required: true,
  })
  @UseGuards(RescuerAuthGuard)
  @Get('/document/download')
  async download(
    @UserId() userId: Types.ObjectId,
    @Res({ passthrough: true }) res: Response,
    @Query('type') type: string,
  ): Promise<StreamableFile> {
    return this.service.download(userId, res, type);
  }
}
