// Create a class for WsResponse

import { WsResponse } from '@nestjs/websockets';

interface CallCenterData {
  message: string;
}

export class CallCenterMessage implements WsResponse<CallCenterData> {
  data: CallCenterData;
  event: string;

  // Create a static property to store the event name
  static channel = 'message';

  constructor(data: CallCenterData) {
    this.data = data;
    this.event = CallCenterMessage.channel;
  }
}

export interface CallCenterEventData {
  eventType: string;
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

export class CallCenterEvent implements WsResponse<CallCenterEventData> {
  data: CallCenterEventData;
  event: string;

  // Create a static property to store the event name
  static channel = 'emergency';

  constructor(data: CallCenterEventData) {
    this.data = data;
    this.event = CallCenterEvent.channel;
  }
}
