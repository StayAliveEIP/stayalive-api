import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StatusService } from './status.service';
import {
  RescuerAuthGuard,
  RescuerDocumentGuard,
} from '../../../guards/auth.route.guard';
import { StatusDto } from './status.dto';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';
import { SuccessMessage } from '../../../dto.dto';

@Controller('/rescuer')
@ApiTags('Status')
@ApiBearerAuth()
export class StatusController {
  constructor(private readonly status: StatusService) {}

  @UseGuards(RescuerAuthGuard)
  @UseGuards(RescuerDocumentGuard)
  @Get('/status')
  @ApiResponse({
    status: 200,
    description: 'The status of the rescuer.',
    type: StatusDto,
  })
  @ApiOperation({
    summary: 'Get the status of the rescuer.',
  })
  async getStatus(@UserId() userId: Types.ObjectId): Promise<StatusDto> {
    return this.status.getStatus(userId);
  }

  @UseGuards(RescuerAuthGuard)
  @UseGuards(RescuerDocumentGuard)
  @ApiResponse({
    status: 200,
    type: SuccessMessage,
    description: 'The status was changed.',
  })
  @ApiBody({
    type: StatusDto,
  })
  @ApiOperation({
    summary: 'Set the status of the rescuer.',
  })
  @Post('/status')
  async setStatus(
    @UserId() userId: Types.ObjectId,
    @Body() body: StatusDto,
  ): Promise<SuccessMessage> {
    return this.status.setStatus(userId, body.status);
  }
}
