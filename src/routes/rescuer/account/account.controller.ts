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
  ChangeInfosRequest,
  DeleteRescuerAccountRequest,
} from './account.dto';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { async } from 'rxjs';
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
  @Post('/account/infos')
  @ApiResponse({
    status: 200,
    description: 'Change your account infos ( firstname, lastname )',
  })
  async changeInfos(@Request() req: Request, @Body() body: ChangeInfosRequest) {
    const info = await this.service.changeInfos(
      body.firstname,
      body.lastname,
      req,
    );
    if (info.message) {
      this.mail.sendVerifyAccountEmail(
        info.user.email.email,
        info.user.firstname,
        'https://stayalive.fr',
      );
    }
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
