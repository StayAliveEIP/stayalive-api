import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DefibrillatorProposalDto,
  DefibrillatorProposalResponse,
  DefibrillatorResponse,
} from './defibrillator.dto';
import { DefibrillatorService } from './defibrillator.service';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';
import {
  RescuerAuthGuard,
  RescuerDocumentGuard,
} from '../../../guards/auth.route.guard';

@Controller('/rescuer/defibrillator')
@ApiTags('Defibrillator')
export class DefibrillatorController {
  constructor(private readonly defibrillatorService: DefibrillatorService) {}

  @UseGuards(RescuerAuthGuard)
  @UseGuards(RescuerDocumentGuard)
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
  @UseGuards(RescuerDocumentGuard)
  @Get('/propose')
  @ApiResponse({
    status: 200,
    description: 'list of defibrillators proposed by the user.',
    type: [DefibrillatorResponse],
  })
  async getUserDefibrillators(@UserId() userId: Types.ObjectId) {
    return this.defibrillatorService.getUserDefibrillators(userId);
  }

  @UseGuards(RescuerAuthGuard)
  @UseGuards(RescuerDocumentGuard)
  @Get('/')
  @ApiResponse({
    status: 200,
    description: 'list of defibrillators validated by all the users.',
    type: [DefibrillatorResponse],
  })
  async getDefibrillators() {
    return this.defibrillatorService.getDefibrillators();
  }
}
