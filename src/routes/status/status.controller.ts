import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { StatusDto } from './status.dto';

@Controller()
@ApiTags('Status')
export class StatusController {
  constructor(private readonly status: StatusService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/status')
  async getStatus(@Req() req) {
    return this.status.getStatus(req.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: StatusDto })
  @ApiResponse({
    status: 200,
    description: 'The status was changed.',
  })
  @Post('/status')
  async setStatus(@Req() req, @Body() body: StatusDto) {
    return this.status.setStatus(req.userId, body.status);
  }
}
