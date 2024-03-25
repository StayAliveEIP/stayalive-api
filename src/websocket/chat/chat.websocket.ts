import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import * as jwt from 'jsonwebtoken';

type ChatReceive = {
  conversationId: string;
  message: string;
};

@WebSocketGateway({ namespace: '/chat/ws' })
export class ChatWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger: Logger = new Logger(ChatWebsocket.name);
  public rescuerClients: Map<Types.ObjectId, Socket> = new Map<
    Types.ObjectId,
    Socket
  >();
  public callCenterClients: Map<Types.ObjectId, Socket> = new Map<
    Types.ObjectId,
    Socket
  >();

  @WebSocketServer()
  public server: Server;

  handleConnection(@ConnectedSocket() client: Socket): any {
    const token = client.handshake.query.token as string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
        account: string;
      };
      if (decoded.account !== 'rescuer' && decoded.account !== 'callCenter') {
        client.disconnect();
        return;
      }
      if (decoded.account === 'rescuer') {
        this.rescuerClients.set(new Types.ObjectId(decoded.id), client);
        this.logger.log(`Rescuer ${decoded.id} connected.`);
      } else {
        this.callCenterClients.set(new Types.ObjectId(decoded.id), client);
        this.logger.log(`Call center ${decoded.id} connected.`);
      }
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: any): any {
    //search in the rescuerClients and callCenterClients maps and delete the client
    this.rescuerClients.forEach((value, key) => {
      if (value === client) {
        this.rescuerClients.delete(key);
        this.logger.log(`Rescuer ${key} disconnected.`);
      }
    });
    this.callCenterClients.forEach((value, key) => {
      if (value === client) {
        this.callCenterClients.delete(key);
        this.logger.log(`Call center ${key} disconnected.`);
      }
    });
  }

  afterInit() {
    this.logger.log('Chat websocket initialized.');
  }

  @SubscribeMessage('messageRescuer')
  handleMessageRescuer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    // Implement your message handling logic here
    this.logger.log(`Received message: ${JSON.stringify(data)} from client.`);
    //when receive message, send it to the other client and create a message object in the database
  }

  @SubscribeMessage('messageCallCenter')
  handleMessageCallCenter(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    // Implement your message handling logic here
    this.logger.log(`Received message: ${JSON.stringify(data)} from client.`);

    //when receive message, send it to the other client and create a message object in the database
  }
}
