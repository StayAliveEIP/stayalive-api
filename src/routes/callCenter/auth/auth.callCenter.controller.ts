import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import {
  LoginCallCenterRequest,
  LoginCallCenterResponse,
} from './auth.callCenter.dto';
import { AuthCallCenterService } from './auth.callCenter.service';
import { SuccessMessage } from '../../../dto.dto';
import { SendMagicLinkRequest } from '../../rescuer/auth/auth.dto';
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../forgotPassword/forgotPassword.callCenter.dto';

@Controller('/call-center')
@ApiTags('Auth')
export class AuthCallCenterController {
  constructor(
    private readonly service: AuthCallCenterService,
    private mail: ReactEmailService,
  ) {}

  @Post('/auth/login')
  @ApiOperation({
    summary: 'Login the call center',
    description:
      'Return the bearer token for the call center, the email is verified only if the admin was logged in before.',
  })
  @ApiResponse({
    status: 200,
    description: 'The bearer token for the admin Login',
    type: LoginCallCenterResponse,
  })
  async login(
    @Body() body: LoginCallCenterRequest,
  ): Promise<LoginCallCenterResponse> {
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
