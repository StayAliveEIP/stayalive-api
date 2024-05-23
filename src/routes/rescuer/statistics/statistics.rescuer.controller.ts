import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  RescuerAuthGuard,
  RescuerDocumentGuard,
} from '../../../guards/auth.route.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StatisticsRescuerService } from './statistics.rescuer.service';
import { AvailabilityDay, SuccessElement } from './statistics.rescuer.dto';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';

@Controller('/rescuer/statistics')
@UseGuards(RescuerDocumentGuard)
@ApiTags('Statistics')
@ApiBearerAuth()
export class StatisticsRescuerController {
  constructor(private readonly service: StatisticsRescuerService) {}

  @Get('/success')
  @UseGuards(RescuerAuthGuard)
  @ApiOperation({
    summary: 'Get your success as a rescuer',
    description: 'Get your success as a rescuer',
  })
  @ApiResponse({
    status: 200,
    description: 'Your success as a rescuer',
    type: SuccessElement,
    isArray: true,
  })
  async getSuccess(
    @UserId() userId: Types.ObjectId,
  ): Promise<Array<SuccessElement>> {
    return this.service.getSuccess(userId);
  }

  @Get('/availability')
  @UseGuards(RescuerAuthGuard)
  @ApiOperation({
    summary: 'Get your availability time period as a rescuer',
    description:
      'Get your availability time period as a rescuer in the last 30 days.',
  })
  @ApiResponse({
    status: 200,
    description: 'Your availability time period as a rescuer',
    type: AvailabilityDay,
    isArray: true,
  })
  async getAvailability(
    @UserId() userId: Types.ObjectId,
  ): Promise<Array<AvailabilityDay>> {
    return this.service.getAvailability(userId);
  }
}
