import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/rescuer')
export class AppController {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly appService: AppService) {}
}
