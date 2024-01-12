import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { Socket } from 'socket.io';
import {Logger, UseGuards} from '@nestjs/common';
import { Types } from 'mongoose';
import { CallCenterMessage } from './call-center.dto';
import {WsRescuerGuard} from "../../guards/auth.ws.guard";
import {WsCallCenterGuard} from "../../guards/auth.call-center.ws.guard";
import * as jwt from "jsonwebtoken";
import {Call} from "../../database/call.schema";

@WebSocketGateway({ namespace: '/call-center/ws' })
export class CallCenterWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger: Logger = new Logger(CallCenterWebsocket.name);
  public static clients: Map<Types.ObjectId, Socket> = new Map<
    Types.ObjectId,
    Socket
  >();

  @WebSocketServer()
  server: Server;
  @UseGuards(WsCallCenterGuard)
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): any {
    // Traiter le message reçu et éventuellement répondre
    this.logger.log('New message from client: ' + client.id + ' - ' + payload);
    return new CallCenterMessage({
      message: 'coucou',
    });
  }

  handleConnection(@ConnectedSocket() client: Socket): any {
    this.logger.log('Call Center Client connected to server: ' + client.id);
    const token = client.handshake.query.token as string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
        account: string;
      };
      if (decoded.account !== 'callCenter') {
        client.disconnect();
        return false;
      }
      CallCenterWebsocket.clients.set(new Types.ObjectId(decoded.id), client);
      return true;
    } catch (err) {
      this.logger.error(err);
      client.disconnect();
    }
  }

  handleDisconnect(client: any): any {
    this.logger.log('Client disconnected from server: ' + client.id);
    CallCenterWebsocket.clients.forEach((value, key) => {
      if (value.id === client.id) {
        CallCenterWebsocket.clients.delete(key);
      }
    });
  }

  afterInit() {
    this.logger.log('Call websocket server initialized');
  }
}
