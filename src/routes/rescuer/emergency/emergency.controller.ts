import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';
import { SuccessMessage } from '../../../dto.dto';
import { RescuerAuthGuard } from '../../../guards/auth.route.guard';
import { EmergencyAcceptDto, EmergencyHistoryResponse } from './emergency.dto';

@Controller('/rescuer')
@ApiTags('Emergency')
export class EmergencyController {
  constructor(private readonly service: EmergencyService) {}

  @UseGuards(RescuerAuthGuard)
  @Get('/emergency/history')
  @ApiOperation({
    summary: 'Get the history of all your emergencies.',
  })
  @ApiResponse({
    status: 200,
    description: 'The history of all your emergencies.',
    type: EmergencyHistoryResponse,
    isArray: true,
  })
  async getEmergencyHistory(
    @UserId() userId: Types.ObjectId,
  ): Promise<Array<EmergencyHistoryResponse>> {
    return await this.service.getEmergencyHistory(userId);
  }

  @UseGuards(RescuerAuthGuard)
  @Get('/emergency/accept')
  @ApiOperation({
    summary: 'Accept an emergency.',
    description: 'Accept an emergency that has been assigned to you.',
  })
  @ApiResponse({
    status: 200,
    description: 'The emergency was accepted.',
    type: SuccessMessage,
  })
  async acceptEmergency(
    @UserId() userId: Types.ObjectId,
    @Query() emergency: EmergencyAcceptDto,
  ): Promise<SuccessMessage> {
    return await this.service.acceptEmergency(userId, emergency.id);
  }

  @Get('/emergency/terminate')
  async terminateEmergency(
    @UserId() userId: Types.ObjectId,
    @Query('id') emergency: EmergencyAcceptDto,
  ): Promise<SuccessMessage> {
    return await this.service.terminateEmergency(userId, emergency.id);
  }

  @UseGuards(RescuerAuthGuard)
  @Get('/emergency/refuse')
  async refuseEmergency(
    @UserId() userId: Types.ObjectId,
    @Query('id') emergency: EmergencyAcceptDto,
  ): Promise<SuccessMessage> {
    return await this.service.refuseEmergency(userId, emergency.id);
  }
}
