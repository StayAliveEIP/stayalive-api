import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { EmergencyCallCenterService } from './emergency.callCenter.service';
import { UserId } from '../../../decorator/userid.decorator';
import { CallCenterAuthGuard } from '../../../guards/auth.guard';
import { Types } from 'mongoose';
import {
  CreateNewEmergencyRequest,
  EmergencyInfoResponse,
} from './emergency.callCenter.dto';

@Controller('/call-center')
@ApiTags('Emergency')
@ApiBearerAuth()
export class EmergencyCallCenterController {
  constructor(
    private readonly service: EmergencyCallCenterService,
    private mail: ReactEmailService,
  ) {}

  @Get('/emergency')
  @ApiOperation({ summary: 'Get all emergencies that your previously created' })
  @ApiResponse({
    status: 200,
    description: 'The emergencies were found.',
    type: EmergencyInfoResponse,
    isArray: true,
  })
  @UseGuards(CallCenterAuthGuard)
  async getEmergency(
    @UserId() userId: Types.ObjectId,
  ): Promise<Array<EmergencyInfoResponse>> {
    return await this.service.getEmergency(userId);
  }

  @Post('/emergency')
  @ApiOperation({ summary: 'Create a new emergency' })
  @ApiResponse({
    status: 200,
    description: 'The emergency was created.',
    type: EmergencyInfoResponse,
  })
  @UseGuards(CallCenterAuthGuard)
  async createEmergency(
    @UserId() userId: Types.ObjectId,
    @Body() body: CreateNewEmergencyRequest,
  ): Promise<EmergencyInfoResponse> {
    return await this.service.createEmergency(userId, body);
  }
}
