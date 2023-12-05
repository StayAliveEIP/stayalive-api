import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import {
  LoginCallCenterRequest,
  LoginCallCenterResponse,
} from './auth.callCenter.dto';
import { AuthCallCenterService } from './auth.callCenter.service';

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
}
