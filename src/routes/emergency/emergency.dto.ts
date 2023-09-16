export class newEmergencyDto {
  center: string;
  at: {
    x: string;
    y: string;
  };
  description: string;
}

export class modifyEmergencyDto {
  center: string;
  at: {
    x: string;
    y: string;
  };
  description: string;
  id: string;
}

export class deleteEmergencyDto {
    id: string;
}
