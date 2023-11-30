import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { DocumentAdminService } from './document.admin.service';
import { SuccessMessage } from '../../../dto.dto';
import {
  DocumentRescuerAdminChangeStatusRequest,
  DocumentRescuerAdminInfoResponse,
} from './document.admin.dto';
import { Response } from 'express';

@Controller('/admin/rescuer/document')
@ApiTags('Rescuer Document')
@ApiBearerAuth()
export class DocumentAdminController {
  constructor(
    private readonly service: DocumentAdminService,
    private mail: ReactEmailService,
  ) {}

  @Get('/all')
  @ApiOperation({
    summary: 'Get all the documents for a rescuer',
    description: 'Get all the documents for a rescuer.',
  })
  @ApiResponse({
    status: 200,
    description: 'All the documents for a rescuer.',
    type: [DocumentRescuerAdminInfoResponse],
  })
  async all(
    @Query('rescuerId') rescuerId: string,
  ): Promise<Array<DocumentRescuerAdminInfoResponse>> {
    return this.service.all(rescuerId);
  }

  @Post('/status')
  @ApiOperation({
    summary: 'Update the status of a document',
    description: 'Update the status of a document.',
  })
  @ApiResponse({
    status: 200,
    description: 'The document has been validated.',
    type: SuccessMessage,
  })
  async status(
    @Body() body: DocumentRescuerAdminChangeStatusRequest,
  ): Promise<SuccessMessage> {
    return this.service.status(body);
  }

  @Get('/download/:id')
  @ApiOperation({
    summary: 'Download a document',
    description: 'Download a document.',
  })
  async download(
    @Res({ passthrough: true }) res: Response,
    @Query('id') id: string,
  ): Promise<StreamableFile> {
    return this.service.download(id, res);
  }
}
