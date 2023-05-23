import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../../guards/auth.guard';

@Controller()
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/account')
  async index(): Promise<any> {
    return this.service.index();
  }
}
