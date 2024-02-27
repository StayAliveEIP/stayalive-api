import { Injectable } from '@nestjs/common';
import {
  DefibrillatorProposalDto,
  DefibrillatorProposalResponse,
} from './defibrillator.dto';

@Injectable()
export class DefibrillatorService {
  async propose(
    body: DefibrillatorProposalDto,
  ): Promise<DefibrillatorProposalResponse> {}
}
