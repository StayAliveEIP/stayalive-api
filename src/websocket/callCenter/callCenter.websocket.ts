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
import { Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import {InterventionRequest} from "../rescuer/rescuer.dto";
import {CallCenterMessage} from "./call-center.dto";

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
