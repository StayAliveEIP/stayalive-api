import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { Model } from 'mongoose';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { Conversation } from '../../../database/conversation.schema';
import { Message } from '../../../database/message.schema';

@Injectable()
export class ChatRescuerService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly reactEmailService: ReactEmailService,
  ) {}

  async getConversations(userId: string): Promise<Conversation[]> {
    return this.conversationModel.find({ rescuerId: userId });
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messageModel.find({ conversationId });
  }
}
