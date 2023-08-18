import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { PositionDto, PositionWithIdDto } from './position.dto';
import { Observable } from 'rxjs';
import { SuccessMessage } from '../../dto.dto';
import { UserId } from '../../decorator/userid.decorator';
import { Types } from 'mongoose';

@Controller()
@ApiTags('Position')
@ApiBearerAuth()
export class PositionController {
  constructor(private readonly service: PositionService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/position')
  @ApiResponse({
    status: 200,
    description: 'Your position as a rescuer',
    type: PositionDto,
  })
  async getPosition(@UserId() userId: Types.ObjectId): Promise<PositionDto> {
    return this.service.getPosition(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/position')
  @ApiResponse({
    status: 200,
    description: 'Set your position as a rescuer',
    type: PositionDto,
  })
  async setPosition(
    @UserId() userId: Types.ObjectId,
    @Body() body: PositionDto,
  ): Promise<PositionDto> {
    return this.service.setPosition(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/position')
  @ApiResponse({
    status: 200,
    description: 'Delete your position as a rescuer',
    type: PositionDto,
  })
  async deletePosition(
    @UserId() userId: Types.ObjectId,
  ): Promise<SuccessMessage> {
    return this.service.deletePosition(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/position/all')
  @ApiResponse({
    status: 200,
    description: 'Get all positions',
    type: PositionWithIdDto,
    isArray: true,
  })
  async getAllPositions(): Promise<PositionWithIdDto[]> {
    return this.service.getAllPositions();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/position/nearest')
  @ApiResponse({
    status: 200,
    description: 'Get nearest position',
    type: PositionWithIdDto,
  })
  async getNearestPosition(
    @Body() position: PositionDto,
  ): Promise<PositionWithIdDto> {
    return this.service.getNearestPosition(position);
  }

  @UseGuards(JwtAuthGuard)
  @Sse('/position/:id')
  @ApiResponse({
    status: 200,
    description: 'Get the real time position of rescuer',
    type: PositionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'If the id given not correspond to any rescuer',
  })
  sse(@Param('id') id: string): Observable<{ data: PositionDto }> {
    return this.service.getPositionSse(id);
  }
}
