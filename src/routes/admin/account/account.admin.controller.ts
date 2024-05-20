import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { AccountAdminService } from './account.admin.service';
import { SuccessMessage } from '../../../dto.dto';
import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  DeleteAdminRequest,
  DeleteMyAccountRequest,
  InfoResponse,
  NewRequest,
  UpdateAdminAccountRequest,
  VerifyEmailRequest,
} from './account.admin.dto';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';
import {
  AdminAuthGuard,
  RescuerAuthGuard,
} from '../../../guards/auth.route.guard';

@Controller('/admin')
@ApiTags('Account')
@ApiBearerAuth()
export class AccountAdminController {
  constructor(
    private readonly service: AccountAdminService,
    private mail: ReactEmailService,
  ) {}

  @Get('/account/info')
  @ApiOperation({
    summary: 'Get the information about the account',
    description:
      'Return all the information about the account, the email is verified only if the admin was logged in before.',
  })
  @UseGuards(AdminAuthGuard)
  async info(@UserId() userId: Types.ObjectId): Promise<InfoResponse> {
    return this.service.info(userId);
  }

  @Get('/account/all')
  @ApiOperation({
    summary: 'Get all the admin accounts',
    description: 'Return all the admin accounts.',
  })
  @ApiResponse({
    status: 200,
    description: 'All the admin accounts',
    type: [InfoResponse],
  })
  @UseGuards(AdminAuthGuard)
  async all(): Promise<InfoResponse[]> {
    return this.service.all();
  }

  @Post('/account/new')
  @ApiOperation({
    summary: 'Create a new account for an admin',
    description:
      'Create a new account for an admin, after that an email with the password for the account will be send to the email address.',
    deprecated: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The account was created with the success message',
    type: SuccessMessage,
  })
  @UseGuards(AdminAuthGuard)
  async new(@Body() body: NewRequest): Promise<SuccessMessage> {
    return this.service.new(body);
  }

  @Post('/account/delete')
  @ApiOperation({
    summary: 'Delete an admin account with the id of the account',
    description: 'Delete the account of an admin with the id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The account was deleted with the success message',
    type: SuccessMessage,
  })
  @UseGuards(AdminAuthGuard)
  async delete(@Body() body: DeleteAdminRequest): Promise<SuccessMessage> {
    return this.service.delete(body);
  }

  @Post('/account/update')
  @ApiOperation({
    summary: 'Update the account of an admin',
    description: 'Update the account of an admin with the id.',
  })
  @ApiResponse({
    status: 200,
    description: 'The account was updated with the success message',
    type: SuccessMessage,
  })
  @UseGuards(AdminAuthGuard)
  async update(
    @Body() body: UpdateAdminAccountRequest,
  ): Promise<SuccessMessage> {
    return this.service.update(body);
  }

  @Delete('/account/delete')
  @ApiOperation({
    summary: 'Delete the admin account logged in',
    description:
      'Delete the account of the admin logged in, the admin will be logged out after that.',
  })
  @ApiResponse({
    status: 200,
    description: 'The account was deleted with the success message',
    type: SuccessMessage,
  })
  @UseGuards(AdminAuthGuard)
  async deleteMyAccount(
    @UserId() userId: Types.ObjectId,
    @Body() body: DeleteMyAccountRequest,
  ): Promise<SuccessMessage> {
    return this.service.deleteMyAccount(userId, body);
  }

  @Post('/account/password/change-password')
  @ApiOperation({
    summary: 'Change the password of the account',
    description: 'Change the password of the account logged in.',
  })
  @ApiResponse({
    status: 200,
    description: 'The password was changed with the success message',
    type: SuccessMessage,
  })
  @UseGuards(AdminAuthGuard)
  async changePassword(
    @UserId() userId: Types.ObjectId,
    @Body() body: ChangePasswordRequest,
  ): Promise<SuccessMessage> {
    return this.service.changePassword(userId, body);
  }

  @UseGuards(AdminAuthGuard)
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

  @UseGuards(AdminAuthGuard)
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
}
