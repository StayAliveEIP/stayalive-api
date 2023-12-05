import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StatusService } from './status.service';
import { RescuerAuthGuard } from '../../../guards/auth.route.guard';
import { StatusDto } from './status.dto';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';
import { async } from 'rxjs';

@Controller('/rescuer')
@ApiTags('Status')
@ApiBearerAuth()
export class StatusController {
  constructor(private readonly status: StatusService) {}

  @UseGuards(RescuerAuthGuard)
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
  @ApiResponse({
    status: 200,
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
  ): Promise<StatusDto> {
    return this.status.setStatus(userId, body.status);
  }
}
