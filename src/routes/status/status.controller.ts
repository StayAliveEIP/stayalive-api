import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusService } from './status.service';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { StatusDto } from './status.dto';
import {UserId} from "../../decorator/userid.decorator";
import {Types} from "mongoose";
import ObjectId = module

@Controller()
@ApiTags('Status')
export class StatusController {
  constructor(private readonly status: StatusService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/status')
  async getStatus(@UserId() userId) {
    return this.status.getStatus(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: StatusDto })
  @ApiResponse({
    status: 200,
    description: 'The status was changed.',
  })
  @Post('/status')
  async setStatus(@UserId() userId, @Body() body: StatusDto) {
    return this.status.setStatus(userId, body.status);
  }
}
