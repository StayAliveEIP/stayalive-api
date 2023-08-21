import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountIndexResponse } from './account.dto';

@Controller()
@ApiTags('Account')
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly service: AccountService) {}

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
}
