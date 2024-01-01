import { Types } from 'mongoose';

export enum EventType {
  EMERGENCY_CREATED = 'emergency.created',
  EMERGENCY_ASK_ASSIGN = 'emergency.ask.assign',
  EMERGENCY_ASSIGNED = 'emergency.assigned',
  EMERGENCY_CANCELED = 'emergency.canceled',
  EMERGENCY_TERMINATED = 'emergency.terminate',
}

export class EmergencyAskAssignEvent {
  emergencyId: Types.ObjectId;
  rescuerId: Types.ObjectId;
  info: string;
  position: {
    lat: number;
    lng: number;
  };
}

export class EmergencyCreatedEvent {
  emergencyId: Types.ObjectId;
  lat: number;
  long: number;
  info: string;
}

export class EmergencyAssignedEvent {
  emergencyId: Types.ObjectId;
  rescuerId: Types.ObjectId;
}

export class EmergencyCanceledEvent {
  emergencyId: Types.ObjectId;
}

export class EmergencyTerminatedEvent {
  emergencyId: Types.ObjectId;
}
