import { IsNotEmpty, IsString } from 'class-validator';

export class newEmergencyDto {
  @IsString()
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  at: {
    x: string;
    y: string;
  };

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  for: string;
}

export class modifyEmergencyDto {
  @IsString()
  @IsNotEmpty()
  from: string;

  at: {
    x: string;
    y: string;
  };

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  for: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}

export class deleteEmergencyDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class getEmergencyDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class getEmergencyOfRescuerDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class cancelEmergencyDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class assignEmergencyDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  rescuer: string;
}

export class finishEmergencyDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
