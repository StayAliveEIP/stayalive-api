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
import { Types} from 'mongoose';
@WebSocketGateway({ namespace: '/rescuer/ws' })
export class RescuerWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger: Logger = new Logger(RescuerWebsocket.name);
  private clients: Map<Types.ObjectId, any> = new Map<Types.ObjectId, any>();

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
  handleConnection(@ConnectedSocket() client: any): any {
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
      this.clients.set(new Types.ObjectId(decoded.id), client);
      return true;
    } catch (err) {
      this.logger.log(err);
      client.disconnect();
    }
  }
  handleDisconnect(client: any): any {
    this.logger.log('Client disconnected from server: ' + client.id)
    this.clients.forEach((value, key) => {
      if (value.id === client.id) {
        this.clients.delete(key);
      }
    });
  }

  afterInit(server: any): any {
    this.logger.log('Rescuer websocket server initialized');
  }
}
