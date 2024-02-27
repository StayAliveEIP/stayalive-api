import { Injectable } from '@nestjs/common';
import { DefibrillatorProposalDto } from './defibrillator.dto';

@Injectable()
export class DefibrillatorService {
  async proposa(body: DefibrillatorProposalDto) {}
}
