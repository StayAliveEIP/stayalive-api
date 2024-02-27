import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DefibrillatorProposalDto,
  DefibrillatorProposalResponse,
} from './defibrillator.dto';
import { DefibrillatorService } from './defibrillator.service';

@Controller('/rescuer/defibrillator')
@ApiTags('Defibrillator')
export class DefibrillatorController {
  constructor(private readonly defibrillatorService: DefibrillatorService) {}

  @Post('/propose')
  @ApiBody({ type: DefibrillatorProposalDto })
  @ApiResponse({
    status: 200,
    description: 'The account was created.',
    type: DefibrillatorProposalResponse,
  })
  async propose(
    @Body() body: DefibrillatorProposalDto,
  ): Promise<DefibrillatorProposalResponse> {
    return this.defibrillatorService.propose(body);
  }
}
