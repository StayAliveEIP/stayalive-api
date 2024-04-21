import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Conversation } from '../../../database/conversation.schema';
import { Types } from 'mongoose';
import {
  RescuerAuthGuard,
  RescuerDocumentGuard,
} from '../../../guards/auth.route.guard';
import { ApiResponse } from '@nestjs/swagger';
import { ChatRescuerService } from './chat.rescuer.service';
import { Message } from '../../../database/message.schema';
import { UserId } from '../../../decorator/userid.decorator';

@Controller('rescuer/chat')
export class ChatRescuerController {
  constructor(private readonly chatService: ChatRescuerService) {}

  @UseGuards(RescuerAuthGuard)
  @UseGuards(RescuerDocumentGuard)
  @Get('/conversations')
  @ApiResponse({
    status: 200,
    description: 'list of conversations of the user.',
  })
  async getConversations(
    @UserId() userId: Types.ObjectId,
  ): Promise<Conversation[]> {
    return this.chatService.getConversations(userId);
  }

  @UseGuards(RescuerAuthGuard)
  @UseGuards(RescuerDocumentGuard)
  @Get('/messages')
  @ApiResponse({
    status: 200,
    description: 'list of messages of the conversation.',
  })
  async getMessages(
    @Query('id') conversationId: Types.ObjectId,
  ): Promise<Message[]> {
    return this.chatService.getMessages(conversationId);
  }
}
