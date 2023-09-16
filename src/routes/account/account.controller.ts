import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountIndexResponse, ChangeInfosRequest } from './account.dto';
import { ReactEmailService } from "../../services/react-email/react-email.service";

@Controller()
@ApiTags('Account')
export class AccountController {
  constructor(
    private readonly service: AccountService,
    private mail: ReactEmailService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/account')
  @ApiResponse({
    status: 200,
    description: 'The information about your account',
    type: AccountIndexResponse,
  })
  async index(@Request() req: Request): Promise<AccountIndexResponse> {
    return this.service.index(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/account/infos')
  @ApiResponse({
    status: 200,
    description: 'Change your account infos ( firstname, lastname )',
  })
  async changeInfos(@Request() req: Request, @Body() body: ChangeInfosRequest) {
    return this.service.changeInfos(body.firstname, body.lastname, req);
  }

  @Get('/hello')
  async hello() {
    this.mail.sendVerifyAccountEmail(
      'florian.damiot@gmail.com',
      'Florian',
      'https://stayalive.fr',
    );
    return 'ok';
  }
}
