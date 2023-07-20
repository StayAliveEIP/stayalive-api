import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';

@Controller()
@ApiTags('Status')
export class StatusController {
  constructor(private readonly status: StatusService) {}
}
