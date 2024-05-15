import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { ForgotPasswordCallCenterService } from './forgotPassword.callCenter.service';
import { SuccessMessage } from '../../../dto.dto';
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from './forgotPassword.callCenter.dto';

@Controller('/call-center')
@ApiTags('Forgot Password')
export class ForgotPasswordCallCenterController {
  constructor(
    private readonly service: ForgotPasswordCallCenterService,
    private _mail: ReactEmailService,
  ) {}

  @Post('/forgot-password/forgot')
  @ApiOperation({
    summary: 'Send a email to the call center to reset the password.',
    description:
      'An email will be sent to the call center with a link to reset the password.',
  })
  @ApiResponse({
    status: 200,
    description: 'The email was sent.',
    type: SuccessMessage,
  })
  async forgotPassword(
    @Body() body: ForgotPasswordRequest,
  ): Promise<SuccessMessage> {
    return this.service.forgotPassword(body);
  }

  @Post('/forgot-password/reset')
  @ApiOperation({
    summary: 'Reset the password of the call center.',
    description: 'Reset the password of the call center.',
  })
  @ApiResponse({
    status: 200,
    description: 'The password was reset.',
    type: SuccessMessage,
  })
  async resetPassword(
    @Body() body: ResetPasswordRequest,
  ): Promise<SuccessMessage> {
    return this.service.resetPassword(body);
  }
}
