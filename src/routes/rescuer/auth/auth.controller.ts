import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDTO,
  LoginResponse,
  RegisterDTO,
  RegisterResponse,
  SendMagicLinkRequest,
} from './auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessMessage } from '../../../dto.dto';

@Controller('/rescuer')
@ApiTags('Authentification')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/auth/register')
  @ApiBody({ type: RegisterDTO })
  @ApiResponse({
    status: 200,
    description: 'The account was created.',
    type: RegisterResponse,
  })
  async register(@Body() body: RegisterDTO): Promise<RegisterResponse> {
    return this.service.register(body);
  }

  @Post('/auth/login')
  @ApiBody({ type: LoginDTO })
  @ApiResponse({
    status: 200,
    description: 'The rescuer was logged in.',
    type: LoginResponse,
  })
  async login(@Body() body: LoginDTO): Promise<LoginResponse> {
    return this.service.login(body);
  }

  @Post('/auth/magic-link')
  @ApiOperation({
    summary: 'Send a magic link to the rescuer.',
    description: 'An email will be sent to the rescuer with a magic link.',
  })
  @ApiResponse({
    status: 200,
    description: 'The magic link was sent.',
    type: SuccessMessage,
  })
  async sendMagicLink(
    @Body() body: SendMagicLinkRequest,
  ): Promise<SuccessMessage> {
    return this.service.sendMagicLink(body);
  }
}
