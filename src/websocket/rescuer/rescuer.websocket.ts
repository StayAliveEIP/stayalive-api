import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { Logger } from '@nestjs/common';
import { InterventionRequest } from './rescuer.dto';

@WebSocketGateway({ namespace: '/rescuer/ws' })
export class RescuerWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger: Logger = new Logger(RescuerWebsocket.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(InterventionRequest.channel)
  handleMessage(client: any, payload: any): InterventionRequest {
    this.logger.log('New message from client: ' + client.id + ' - ' + payload);
    return new InterventionRequest({
      message: 'coucou',
    });
  }

  handleConnection(data: any): any {
    this.logger.log('Client connected to server: ' + data.id);
  }

  handleDisconnect(client: any): any {
    this.logger.log('Client disconnected from server: ' + client.id);
  }

  afterInit(server: any): any {
    this.logger.log('Rescuer websocket server initialized');
  }
}
