import { Types } from 'mongoose';

export enum EventType {
  EMERGENCY_CREATED = 'emergency.created',
  EMERGENCY_ASK_ASSIGN = 'emergency.ask.assign',
  EMERGENCY_ASSIGNED = 'emergency.assigned',
  EMERGENCY_CANCELED = 'emergency.canceled',
  EMERGENCY_COMPLETED = 'emergency.completed',
}

export class EmergencyAskAssignEvent {
  emergencyId: Types.ObjectId;
  rescuerId: Types.ObjectId;
}

export class EmergencyCreatedEvent {
  emergencyId: Types.ObjectId;
  lat: number;
  long: number;
}

export class EmergencyAssignedEvent {
  emergencyId: Types.ObjectId;
  rescuerId: Types.ObjectId;
}

export class EmergencyCanceledEvent {
  emergencyId: Types.ObjectId;
}

export class EmergencyCompletedEvent {
  emergencyId: Types.ObjectId;
}
