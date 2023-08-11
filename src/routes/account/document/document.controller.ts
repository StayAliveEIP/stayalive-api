import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from '../../../guards/auth.guard';
import { AccountIndexResponse } from '../account.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
@ApiTags('Document')
@ApiBearerAuth()
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/account/document')
  @UseInterceptors(FilesInterceptor('files', 1))
  async upload(
    @UploadedFiles() file: Array<Express.Multer.File>,
  ): Promise<AccountIndexResponse> {
    return this.service.upload(file);
  }
}
