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
  DeleteAdminRequest,
  DeleteMyAccountRequest,
  InfoResponse,
  NewRequest,
} from './account.admin.dto';
import { UserId } from '../../../decorator/userid.decorator';
import { Types } from 'mongoose';
import { async } from 'rxjs';
import { AdminAuthGuard } from '../../../guards/auth.route.guard';

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
  async index(@UserId() userId: Types.ObjectId): Promise<InfoResponse> {
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
  async delete(@Body() body: DeleteAdminRequest): Promise<SuccessMessage> {
    return this.service.delete(body);
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
  async deleteMyAccount(
    @UserId() userId: Types.ObjectId,
    @Body() body: DeleteMyAccountRequest,
  ): Promise<SuccessMessage> {
    return this.service.deleteMyAccount(userId, body);
  }
}
