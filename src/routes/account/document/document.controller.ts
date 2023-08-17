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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../../../guards/auth.guard';
import { AccountIndexResponse } from '../account.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentInformation } from './document.dto';
import type { Response, Request } from 'express';

@Controller()
@ApiTags('Document')
@ApiBearerAuth()
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/account/document')
  async documentInformation(
    @Req() req: Request,
    @Query('type') type: string,
  ): Promise<Array<DocumentInformation>> {
    return this.service.documentInformation(req, type);
  }

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
  ): Promise<AccountIndexResponse> {
    return this.service.upload(req, type, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/account/document/download')
  async download(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('type') type: string,
  ): Promise<any> {
    return this.service.download(req, res, type);
  }
}
