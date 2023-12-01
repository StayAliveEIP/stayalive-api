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

@WebSocketGateway({ path: '/rescuer/ws' })
export class RescuerWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(RescuerWebsocket.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    // Traiter le message reçu et éventuellement répondre
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        this.logger.log('Message reçu: ' + payload);
        client.send(`Message reçu: ${payload}`);
      }
    });
  }

  handleConnection(client: any, ...args: any[]): any {
    this.logger.log('New connection from client: ' + client.id + ' - ' + args);
  }

  handleDisconnect(client: any): any {
    this.logger.log('Client disconnected from server: ' + client.id);
  }

  afterInit(server: any): any {
    this.logger.log('Rescuer websocket server initialized');
  }
}
