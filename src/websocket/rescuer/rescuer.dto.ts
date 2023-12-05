// Create a class for WsResponse

import { WsResponse } from '@nestjs/websockets';

interface InterventionRequestData {
  message: string;
}

export class InterventionRequest
  implements WsResponse<InterventionRequestData>
{
  data: InterventionRequestData;
  event: string;

  // Create a static property to store the event name
  static channel = 'interventionRequest';

  constructor(data: InterventionRequestData) {
    this.data = data;
    this.event = InterventionRequest.channel;
  }
}
