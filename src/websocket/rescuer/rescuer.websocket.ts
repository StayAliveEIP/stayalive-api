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
import { Logger, UseGuards } from '@nestjs/common';
import { InterventionRequest } from './rescuer.dto';
import { WsRescuerGuard } from '../../guards/auth.ws.guard';
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

@WebSocketGateway({ namespace: '/rescuer/ws' })
export class RescuerWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger: Logger = new Logger(RescuerWebsocket.name);
  private clients: Map<any, ObjectId> = new Map<any, ObjectId>();

  @WebSocketServer()
  server: Server;

  @UseGuards(WsRescuerGuard)
  @SubscribeMessage(InterventionRequest.channel)
  handleMessage(client: any, payload: any): InterventionRequest {
    this.logger.log('New message from client: ' + client.id + ' - ' + payload);
    return new InterventionRequest({
      message: 'coucou',
    });
  }
  handleConnection(@ConnectedSocket() client): any {
    this.logger.log('Client connected to server: ' + client.id);
    const token = client.handshake.query.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
        account: string;
      };
      if (decoded.account !== 'rescuer') {
        client.disconnect();
        return false;
      }
      this.clients.set(decoded.id, client.id);
      return true;
    } catch (err) {
      this.logger.log(err);
      client.disconnect();
    }
  }
  handleDisconnect(client: any): any {
    this.logger.log('Client disconnected from server: ' + client.id);
  }

  afterInit(server: any): any {
    this.logger.log('Rescuer websocket server initialized');
  }
}
