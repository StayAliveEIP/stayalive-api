import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { RescuerAuthGuard } from '../../../guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AccountIndexResponse,
  ChangeEmailRequest,
  ChangePasswordRequest,
  ChangePhoneRequest,
  DeleteRescuerAccountRequest,
  VerifyEmailRequest,
  VerifyPhoneRequest,
} from './account.dto';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { SuccessMessage } from '../../../dto.dto';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';

@Controller('/rescuer')
@ApiTags('Account')
@ApiBearerAuth()
export class AccountController {
  constructor(
    private readonly service: AccountService,
    private mail: ReactEmailService,
  ) {}

  @UseGuards(RescuerAuthGuard)
  @Get('/account')
  @ApiResponse({
    status: 200,
    description: 'The information about your account',
    type: AccountIndexResponse,
  })
  async index(@Request() req: Request): Promise<AccountIndexResponse> {
    return this.service.index(req);
  }

  @UseGuards(RescuerAuthGuard)
  @Post('/account/change-password')
  @ApiResponse({
    status: 200,
    description: 'Change your password',
  })
  @ApiOperation({
    summary: 'Change your password',
    description: 'Change your password.',
  })
  async changePassword(
    @UserId() userId: Types.ObjectId,
    @Body() body: ChangePasswordRequest,
  ): Promise<SuccessMessage> {
    return this.service.changePassword(userId, body);
  }

  @UseGuards(RescuerAuthGuard)
  @Post('/account/change-email')
  @ApiResponse({
    status: 200,
    description: 'Change your email',
  })
  @ApiOperation({
    summary: 'Change your email',
    description: 'Change your email.',
  })
  async changeEmail(
    @UserId() userId: Types.ObjectId,
    @Body() body: ChangeEmailRequest,
  ): Promise<SuccessMessage> {
    return this.service.changeEmail(userId, body);
  }

  @UseGuards(RescuerAuthGuard)
  @Post('/account/change-phone')
  @ApiResponse({
    status: 200,
    description: 'Change your phone',
  })
  @ApiOperation({
    summary: 'Change your phone',
    description: 'Change your phone.',
  })
  async changePhone(
    @UserId() userId: Types.ObjectId,
    @Body() body: ChangePhoneRequest,
  ): Promise<SuccessMessage> {
    return this.service.changePhone(userId, body);
  }

  @UseGuards(RescuerAuthGuard)
  @Post('/account/verify-email')
  @ApiResponse({
    status: 200,
    description: 'Verify your email',
  })
  @ApiOperation({
    summary: 'Verify your email',
    description: 'Verify your email.',
  })
  async verifyEmail(
    @UserId() userId: Types.ObjectId,
    @Body() body: VerifyEmailRequest,
  ): Promise<SuccessMessage> {
    return this.service.verifyEmail(userId, body);
  }

  @UseGuards(RescuerAuthGuard)
  @Post('/account/verify-phone')
  @ApiResponse({
    status: 200,
    description: 'Verify your phone',
  })
  @ApiOperation({
    summary: 'Verify your phone',
    description: 'Verify your phone.',
  })
  async verifyPhone(
    @UserId() userId: Types.ObjectId,
    @Body() body: VerifyPhoneRequest,
  ): Promise<SuccessMessage> {
    return this.service.verifyPhone(userId, body);
  }

  @UseGuards(RescuerAuthGuard)
  @Delete('/account')
  @ApiResponse({
    status: 200,
    description: 'Delete your account',
  })
  @ApiOperation({
    summary: 'Delete your account',
    description: 'Delete your account.',
  })
  async deleteAccount(
    @UserId() userId: Types.ObjectId,
    @Body() body: DeleteRescuerAccountRequest,
  ): Promise<SuccessMessage> {
    return this.service.deleteAccount(userId, body);
  }
}
