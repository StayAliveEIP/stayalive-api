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
  EmergencyAskAssignEvent, EmergencyCreatedEvent,
  EventType,
} from '../../services/emergency-manager/emergencyManager.dto';
import {CallCenterEvent, CallCenterEventData} from "../callCenter/callCenter.dto";

@WebSocketGateway({ namespace: '/rescuer/ws' })
export class RescuerWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger: Logger = new Logger(RescuerWebsocket.name);
  public static clients: Map<Types.ObjectId, Socket> = new Map<
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
    this.logger.debug('Connected sockets: ' + RescuerWebsocket.clients.size);
    const client = this.getSocketWithId(event.rescuer._id);
    if (!client) {
      this.logger.log('No client found for rescuer ' + event.rescuer._id + '.');
      return;
    }
    this.logger.log('Found client for rescuer ' + event.rescuer._id + '.');

    const object = {
      type: 'askAssign',
      emergencyId: event.emergency._id,
      rescuerId: event.rescuer._id,
      info: event.emergency.info,
      position: event.emergency.position,
    };

    client.emit(InterventionRequest.channel, object);
  }

  private getSocketWithId(id: Types.ObjectId): Socket | null {
    for (const [key, value] of RescuerWebsocket.clients) {
      if (key.equals(id)) {
        return value;
      }
    }
    return null;
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
      RescuerWebsocket.clients.set(new Types.ObjectId(decoded.id), client);
      return true;
    } catch (err) {
      this.logger.error(err);
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
    RescuerWebsocket.clients.forEach((value, key) => {
      if (value.id === client.id) {
        RescuerWebsocket.clients.delete(key);
      }
    });
  }

  afterInit() {
    this.logger.log('Rescuer websocket server initialized');
  }

  @OnEvent(EventType.EMERGENCY_TIMEOUT)
  handleEmergencyTimeout(event: EmergencyCreatedEvent) {
    const socket = this.getSocketWithId(event.callCenter._id);
    if (!socket) {
      return;
    }
    const eventData: CallCenterEventData = {
      eventType: EventType.EMERGENCY_TIMEOUT,
      callCenter: {
        id: event.callCenter._id.toHexString(),
        name: event.callCenter.name,
      },
      emergency: {
        id: event.emergency._id.toHexString(),
        info: event.emergency.info,
        position: {
          latitude: event.emergency.position.lat,
          longitude: event.emergency.position.long,
        },
        status: event.emergency.status,
      },
      rescuer: null,
    };
    const callCenterEvent = new CallCenterEvent(eventData);
    socket.emit(InterventionRequest.channel, callCenterEvent);
  }
}
