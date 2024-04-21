import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
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
import { PositionService } from './position.service';
import { PositionDto } from './position.dto';
import { SuccessMessage } from '../../../dto.dto';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';

@Controller('/rescuer')
@UseGuards(RescuerDocumentGuard)
@ApiTags('Position')
@ApiBearerAuth()
export class PositionController {
  constructor(private readonly service: PositionService) {}

  @UseGuards(RescuerAuthGuard)
  @Get('/position')
  @ApiOperation({
    summary: 'Get your actual position save as a rescuer',
  })
  @ApiResponse({
    status: 200,
    description: 'Your position as a rescuer',
    type: PositionDto,
  })
  async getPosition(@UserId() userId: Types.ObjectId): Promise<PositionDto> {
    return this.service.getPosition(userId);
  }

  @UseGuards(RescuerAuthGuard)
  @UseGuards(RescuerDocumentGuard)
  @Post('/position')
  @ApiOperation({
    summary: 'Set your position as a rescuer',
  })
  @ApiResponse({
    status: 200,
    description: 'Set your position as a rescuer',
    type: PositionDto,
  })
  async setPosition(
    @UserId() userId: Types.ObjectId,
    @Body() body: PositionDto,
  ): Promise<PositionDto> {
    return this.service.setPosition(userId, body);
  }

  @UseGuards(RescuerAuthGuard)
  @UseGuards(RescuerDocumentGuard)
  @Delete('/position')
  @ApiOperation({
    summary: 'Delete your position as a rescuer.',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete your position as a rescuer',
    type: PositionDto,
  })
  async deletePosition(
    @UserId() userId: Types.ObjectId,
  ): Promise<SuccessMessage> {
    return this.service.deletePosition(userId);
  }

  disconnectRedis() {
    return this.service.disconnectRedis();
  }
}
