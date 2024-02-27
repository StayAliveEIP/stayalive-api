import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { RegisterDTO, RegisterResponse } from '../auth/auth.dto';

@Controller('/rescuer/defibrillator')
@ApiTags('Defibrillator')
export class DefibrillatorController {
  constructor(private readonly defibrillatorService: DefibrillatorController) {}

  @Post('/propose')
  @ApiBody({ type: RegisterDTO })
  @ApiResponse({
    status: 200,
    description: 'The account was created.',
    type: RegisterResponse,
  })
  async register(@Body() body: RegisterDTO): Promise<RegisterResponse> {
    return this.service.register(body);
  }
}
