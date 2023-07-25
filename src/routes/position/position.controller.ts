import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { PositionDeletedDto, PositionDto } from './position.dto';

@Controller()
@ApiTags('Position')
export class PositionController {
  constructor(private readonly service: PositionService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/position')
  @ApiResponse({
    status: 200,
    description: 'Your position as a rescuer',
    type: PositionDto,
  })
  async getPosition(@Request() req: Request): Promise<PositionDto> {
    return this.service.getPosition(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/position')
  @ApiResponse({
    status: 200,
    description: 'Set your position as a rescuer',
    type: PositionDto,
  })
  async setPosition(
    @Request() req: Request,
    @Body() body: PositionDto,
  ): Promise<PositionDto> {
    return this.service.setPosition(req, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/position')
  @ApiResponse({
    status: 200,
    description: 'Delete your position as a rescuer',
    type: PositionDto,
  })
  async deletePosition(@Request() req: Request): Promise<PositionDeletedDto> {
    return this.service.deletePosition(req);
  }
}
