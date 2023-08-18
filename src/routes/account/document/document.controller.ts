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
  Req,
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
import { JwtAuthGuard } from '../../../guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentInformation } from './document.dto';
import type { Response, Request } from 'express';
import { SuccessMessage } from '../../../dto.dto';

@Controller()
@ApiTags('Document')
@ApiBearerAuth()
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/account/document')
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
    @Req() req: Request,
    @Query('type') type: string,
  ): Promise<DocumentInformation> {
    return this.service.documentInformation(req, type);
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
  @UseGuards(JwtAuthGuard)
  @Delete('/account/document')
  async delete(
    @Req() req: Request,
    @Query('type') type: string,
  ): Promise<SuccessMessage> {
    return this.service.delete(req, type);
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
  @UseGuards(JwtAuthGuard)
  @Post('/account/document/upload')
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
    @Req() req: Request,
    @Query('type') type: string,
  ): Promise<SuccessMessage> {
    return this.service.upload(req, type, file);
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
  @UseGuards(JwtAuthGuard)
  @Get('/account/document/download')
  async download(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('type') type: string,
  ): Promise<StreamableFile> {
    return this.service.download(req, res, type);
  }
}
