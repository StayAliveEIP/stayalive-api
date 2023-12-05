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
import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EmergencyAskAssignEvent,
  EventType,
} from '../../services/emergency-manager/emergencyManager.dto';
@WebSocketGateway({ namespace: '/rescuer/ws' })
export class RescuerWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger: Logger = new Logger(RescuerWebsocket.name);
  private clients: Map<Types.ObjectId, Socket> = new Map<
    Types.ObjectId,
    Socket
  >();

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

  @OnEvent(EventType.EMERGENCY_ASK_ASSIGN)
  private async onEmergencyAskAssign(event: EmergencyAskAssignEvent) {
    const clientId = this.clients.get(event.rescuerId);
    if (!clientId) {
      this.logger.log('No client found for rescuer ' + event.rescuerId + '.');
      return;
    }
    this.logger.log(
      'Found client for rescuer ' +
        event.rescuerId +
        ' with id ' +
        clientId +
        '.',
    );
    const client = this.clients.get(event.rescuerId);
    if (!client) {
      this.logger.log('No client found for rescuer ' + event.rescuerId + '.');
      return;
    }
    this.logger.log(
      'Found client for rescuer ' +
        event.rescuerId +
        ' with id ' +
        clientId +
        '.',
    );
    client.send(
      JSON.stringify({
        event: InterventionRequest.channel,
        data: {
          message: 'coucou',
        },
      }),
    );
  }

  /**
   * This method is called when a client connects to the websocket server.
   * It will check if the client is a valid rescuer and if it is, it will add it to the clients map.
   * @param client The client that connected to the websocket server.
   */
  handleConnection(@ConnectedSocket() client: Socket): any {
    this.logger.log('Client connected to server: ' + client.id);
    const token = client.handshake.query.token as string;
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
      console.log(this.clients);
      return true;
    } catch (err) {
      this.logger.log(err);
      client.disconnect();
    }
  }

  /**
   * This method is called when a client disconnects from the websocket server.
   * It will remove the client from the clients map.
   * @param client The client that disconnected from the websocket server.
   */
  handleDisconnect(client: any): any {
    this.logger.log('Client disconnected from server: ' + client.id);
    this.clients.forEach((value, key) => {
      if (value.id === client.id) {
        this.clients.delete(key);
      }
    });
    console.log(this.clients);
  }

  afterInit(server: any): any {
    this.logger.log('Rescuer websocket server initialized');
  }
}
