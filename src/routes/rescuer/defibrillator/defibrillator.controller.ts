import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DefibrillatorProposalDto,
  DefibrillatorProposalResponse,
} from './defibrillator.dto';
import { DefibrillatorService } from './defibrillator.service';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';
import { RescuerAuthGuard } from '../../../guards/auth.route.guard';

@Controller('/rescuer/defibrillator')
@ApiTags('Defibrillator')
export class DefibrillatorController {
  constructor(private readonly defibrillatorService: DefibrillatorService) {}

  @UseGuards(RescuerAuthGuard)
  @Post('/propose')
  @ApiBody({ type: DefibrillatorProposalDto })
  @ApiResponse({
    status: 200,
    description: 'The account was created.',
    type: DefibrillatorProposalResponse,
  })
  async propose(
    @UserId() userId: Types.ObjectId,
    @Body() body: DefibrillatorProposalDto,
  ): Promise<DefibrillatorProposalResponse> {
    return this.defibrillatorService.propose(body, userId);
  }

  @UseGuards(RescuerAuthGuard)
  @Get('/propose')
  @ApiResponse({
    status: 200,
    description: 'list of defibrillators proposed by the user.',
  })
  async getUserDefibrillators(@UserId() userId: Types.ObjectId) {
    return this.defibrillatorService.getUserDefibrillators(userId);
  }

  @UseGuards(RescuerAuthGuard)
  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'list of defibrillators validated by all the users.',
  })
  async getDefibrillators() {
    return this.defibrillatorService.getDefibrillators();
  }
}
