import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { LoginAdminRequest, LoginAdminResponse } from './auth.admin.dto';
import { AuthAdminService } from './auth.admin.service';

@Controller('/admin')
@ApiTags('Auth')
export class AuthAdminController {
  constructor(
    private readonly service: AuthAdminService,
    private mail: ReactEmailService,
  ) {}

  @Post('/auth/login')
  @ApiOperation({
    summary: 'Login to the admin Login',
    description:
      'Return the bearer token for the admin Login, the email is verified only if the admin was logged in before.',
  })
  @ApiResponse({
    status: 200,
    description: 'The bearer token for the admin Login',
    type: LoginAdminResponse,
  })
  async login(@Body() body: LoginAdminRequest): Promise<LoginAdminResponse> {
    return this.service.login(body);
  }
}
