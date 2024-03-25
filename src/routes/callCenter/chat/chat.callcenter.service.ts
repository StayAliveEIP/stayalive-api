import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { Model, Types } from 'mongoose';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { Conversation } from '../../../database/conversation.schema';
import { Message } from '../../../database/message.schema';
import { CallCenter } from '../../../database/callCenter.schema';

@Injectable()
export class ChatCallCenterService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async getConversations(userId: Types.ObjectId): Promise<Conversation[]> {
    return this.conversationModel.find({ callCenterId: userId });
  }

  async getMessages(conversationId: Types.ObjectId): Promise<Message[]> {
    return this.messageModel.find({
      conversationId: new Types.ObjectId(conversationId),
    });
  }
}
