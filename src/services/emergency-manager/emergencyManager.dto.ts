import { CallCenter } from '../../database/callCenter.schema';
import { Emergency } from '../../database/emergency.schema';
import { Rescuer } from '../../database/rescuer.schema';

export enum EventType {
  EMERGENCY_CREATED = 'emergency.created',
  EMERGENCY_ASK_ASSIGN = 'emergency.ask.assign',
  EMERGENCY_ASSIGNED = 'emergency.assigned',
  EMERGENCY_CANCELED = 'emergency.canceled',
  EMERGENCY_TERMINATED = 'emergency.terminate',
  EMERGENCY_REFUSED = 'emergency.refused',
}

export class EmergencyAskAssignEvent {
  callCenter: CallCenter;
  emergency: Emergency;
  rescuer: Rescuer;
}

export class EmergencyCreatedEvent {
  callCenter: CallCenter;
  emergency: Emergency;
}

export class EmergencyAssignedEvent {
  callCenter: CallCenter;
  emergency: Emergency;
  rescuer: Rescuer;
}

export class EmergencyCanceledEvent {
  callCenter: CallCenter;
  emergency: Emergency;
  rescuer: Rescuer;
}

export class EmergencyTerminatedEvent {
  callCenter: CallCenter;
  emergency: Emergency;
  rescuer: Rescuer;
}

export class EmergencyRefusedEvent {
  callCenter: CallCenter;
  emergency: Emergency;
  rescuer: Rescuer;
}
