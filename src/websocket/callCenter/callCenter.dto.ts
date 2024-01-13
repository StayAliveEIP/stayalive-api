// Create a class for WsResponse

import { WsResponse } from '@nestjs/websockets';

export enum CallCenterEventType {
  CREATED = 'CREATED',
  CANCELED = 'CANCELED',
  ASSIGNED = 'ASSIGNED',
  REFUSED = 'REFUSED',
  ASK_ASSIGN = 'ASK_ASSIGN',
  ASK_TIMEOUT = 'ASK_TIMEOUT',
  TERMINATED = 'TERMINATED',
}

export interface CallCenterWsData {
  eventType: CallCenterEventType;
  emergency: {
    id: string;
    info: string;
    position: {
      latitude: number;
      longitude: number;
    };
    status: string;
  };
  callCenter: {
    id: string;
    name: string;
  };
  rescuer: {
    id: string;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
  } | null;
}

export class CallCenterWsResponse implements WsResponse<CallCenterWsData> {
  data: CallCenterWsData;
  event: string;

  // Create a static property to store the event name
  static channel = 'message';

  constructor(data: CallCenterWsData) {
    this.data = data;
    this.event = CallCenterWsResponse.channel;
  }
}
