import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { AccountCallCenterService } from './account.callCenter.service';
import { SuccessMessage } from '../../../dto.dto';
import {
  AccountInformationResponse,
  UpdateAddressRequest,
  UpdateNameRequest,
} from './account.callCenter.dto';
import { Types } from 'mongoose';
import { UserId } from '../../../decorator/userid.decorator';
import { CallCenterAuthGuard } from '../../../guards/auth.route.guard';

@Controller('/call-center/account')
@ApiTags('Account')
@ApiBearerAuth()
export class AccountCallCenterController {
  constructor(
    private readonly service: AccountCallCenterService,
    private mail: ReactEmailService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get the information about the account',
    description:
      'Return all the information about the account, the email is verified only if the call center was logged in before.',
  })
  @ApiResponse({
    status: 200,
    description: 'The call center account',
    type: AccountInformationResponse,
  })
  @UseGuards(CallCenterAuthGuard)
  async info(
    @UserId() userId: Types.ObjectId,
  ): Promise<AccountInformationResponse> {
    return this.service.info(userId);
  }

  @Post('/update/name')
  @ApiOperation({
    summary: 'Update the call center name',
    description:
      'Update the call center name, the name must be unique and not empty.',
  })
  @ApiResponse({
    status: 200,
    description: 'The call center name was updated.',
    type: SuccessMessage,
  })
  @UseGuards(CallCenterAuthGuard)
  async updateName(
    @UserId() userId: Types.ObjectId,
    @Body() body: UpdateNameRequest,
  ): Promise<SuccessMessage> {
    return this.service.updateName(userId, body);
  }

  @Post('/update/address')
  @ApiOperation({
    summary: 'Update the call center address',
    description: 'Update the call center address, the address must be unique.',
  })
  @ApiResponse({
    status: 200,
    description: 'The call center address was updated.',
    type: SuccessMessage,
  })
  @UseGuards(CallCenterAuthGuard)
  async updateAddress(
    @UserId() userId: Types.ObjectId,
    @Body() body: UpdateAddressRequest,
  ): Promise<SuccessMessage> {
    return this.service.updateAddress(userId, body);
  }
}
