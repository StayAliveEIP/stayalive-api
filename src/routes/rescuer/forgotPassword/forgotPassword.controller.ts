import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordService } from './forgotPassword.service';
import {
  ForgotPasswordLinkDTO,
  ForgotPasswordLinkResponse,
  ForgotPasswordResetDTO,
} from './forgotPassword.dto';

@Controller('/rescuer')
@ApiTags('Forgot Password')
export class ForgotPasswordController {
  constructor(private readonly service: ForgotPasswordService) {}

  @Get('/forgot-password/link')
  @ApiOperation({
    summary: 'Request a new mail to reset your password',
  })
  @ApiResponse({
    status: 200,
    description: 'Request a new mail to reset your password',
    type: ForgotPasswordLinkResponse,
  })
  @ApiBody({ type: ForgotPasswordLinkDTO })
  async index(
    @Query() body: ForgotPasswordLinkDTO,
  ): Promise<ForgotPasswordLinkResponse> {
    return this.service.index(body);
  }

  @Post('/forgot-password/reset')
  @ApiOperation({
    summary: 'Reset your password',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset your password',
  })
  @ApiBody({ type: ForgotPasswordResetDTO })
  async reset(
    @Body() body: ForgotPasswordResetDTO,
  ): Promise<ForgotPasswordLinkResponse> {
    return this.service.reset(body);
  }
}
