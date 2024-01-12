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
