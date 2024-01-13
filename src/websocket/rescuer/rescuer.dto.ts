// Create a class for WsResponse

import { WsResponse } from '@nestjs/websockets';

export interface RescuerWsData {
  eventType: RescuerEventType;
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
}

export enum RescuerEventType {
  ASK = 'ASK',
  TIMEOUT = 'TIMEOUT',
  TERMINATED = 'TERMINATED',
}

export class RescuerWsResponse implements WsResponse<RescuerWsData> {
  data: RescuerWsData;
  event: string;

  // Create a static property to store the event name
  static channel = 'message';

  constructor(data: RescuerWsData) {
    this.data = data;
    this.event = RescuerWsResponse.channel;
  }
}
