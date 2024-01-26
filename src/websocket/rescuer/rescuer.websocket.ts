import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { Logger } from '@nestjs/common';
import {
  RescuerWsResponse,
  RescuerEventType,
  RescuerWsData,
} from './rescuer.dto';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EmergencyAskAssignEvent,
  EmergencyTerminatedEvent,
  EmergencyTimeoutEvent,
  EventType,
} from '../../services/emergency-manager/emergencyManager.dto';

@WebSocketGateway({ namespace: '/rescuer/ws' })
export class RescuerWebsocket
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger: Logger = new Logger(RescuerWebsocket.name);
  public clients: Map<Types.ObjectId, Socket> = new Map<
    Types.ObjectId,
    Socket
  >();

  @WebSocketServer()
  public server: Server;

  @OnEvent(EventType.EMERGENCY_ASK_ASSIGN)
  onEmergencyAskAssign(event: EmergencyAskAssignEvent) {
    this.logger.debug('Connected sockets: ' + this.clients.size);
    const client = this.getSocketWithId(event.rescuer._id);
    if (!client) {
      this.logger.log('No client found for rescuer ' + event.rescuer._id + '.');
      return;
    }
    this.logger.log('Found client for rescuer ' + event.rescuer._id + '.');

    const object = {
      type: EventType.EMERGENCY_ASK_ASSIGN,
      emergencyId: event.emergency._id,
      rescuerId: event.rescuer._id,
      info: event.emergency.info,
      position: event.emergency.position,
    };

    client.emit(RescuerWsResponse.channel, object);
  }

  private getSocketWithId(id: Types.ObjectId): Socket | null {
    for (const [key, value] of this.clients) {
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
      this.clients.set(new Types.ObjectId(decoded.id), client);
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
    this.clients.forEach((value, key) => {
      if (value.id === client.id) {
        this.clients.delete(key);
      }
    });
  }

  afterInit() {
    this.logger.log('Rescuer websocket server initialized');
  }

  @OnEvent(EventType.EMERGENCY_ASK_ASSIGN)
  handleEmergencyAskAssign(event: EmergencyAskAssignEvent) {
    const socket = this.getSocketWithId(event.rescuer._id);
    if (!socket) {
      return;
    }
    const eventData: RescuerWsData = {
      eventType: RescuerEventType.ASK,
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
    };
    const rescuerEvent = new RescuerWsResponse(eventData);
    socket.emit(RescuerWsResponse.channel, rescuerEvent);
  }

  @OnEvent(EventType.EMERGENCY_TIMEOUT)
  handleEmergencyTimeout(event: EmergencyTimeoutEvent) {
    const socket = this.getSocketWithId(event.callCenter._id);
    if (!socket) {
      return;
    }
    const eventData: RescuerWsData = {
      eventType: RescuerEventType.TIMEOUT,
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
    };
    const rescuerEvent = new RescuerWsResponse(eventData);
    socket.emit(RescuerWsResponse.channel, rescuerEvent);
  }

  @OnEvent(EventType.EMERGENCY_TERMINATED)
  handleEmergencyTerminated(event: EmergencyTerminatedEvent) {
    const socket = this.getSocketWithId(event.callCenter._id);
    if (!socket) {
      return;
    }
    const eventData: RescuerWsData = {
      eventType: RescuerEventType.TERMINATED,
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
    };
    const rescuerEvent = new RescuerWsResponse(eventData);
    socket.emit(RescuerWsResponse.channel, rescuerEvent);
  }
}
