import { Types } from 'mongoose';

export enum EventType {
  EMERGENCY_CREATED = 'emergency.created',
  EMERGENCY_ASSIGNED = 'emergency.assigned',
  EMERGENCY_CANCELED = 'emergency.canceled',
  EMERGENCY_COMPLETED = 'emergency.completed',
}

export class EmergencyCreatedEvent {
  id: Types.ObjectId;
  lat: number;
  long: number;
}

export class EmergencyAssignedEvent {
  id: Types.ObjectId;
  rescuerId: Types.ObjectId;
}

export class EmergencyCanceledEvent {
  id: Types.ObjectId;
}

export class EmergencyCompletedEvent {
  id: Types.ObjectId;
}
