import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { AccountAdminService } from './account.admin.service';
import { SuccessMessage } from '../../../dto.dto';
import { InfoResponse, NewRequest } from './account.admin.dto';

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
    deprecated: true,
  })
  async index(): Promise<InfoResponse> {
    return this.service.info();
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
}
