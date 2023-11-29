import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class newEmergencyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5f9b3b3b9d3b9f1b3b9d3b9f',
  })
  from: string;

  @ApiProperty({
    example: {
      x: '46.787958935540345',
      y: '-71.4065002761879',
    },
  })
  @IsNotEmpty()
  at: {
    x: string;
    y: string;
  };

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Je suis en feu',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5f9b3b3b9d3b9f1b3b9d3b9f',
  })
  for: string;
}

export class modifyEmergencyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5f9b3b3b9d3b9f1b3b9d3b9f',
  })
  from: string;

  @ApiProperty({
    example: {
      x: '46.787958935540345',
      y: '-71.4065002761879',
    },
  })
  at: {
    x: string;
    y: string;
  };

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Je suis en feu',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5f9b3b3b9d3b9f1b3b9d3b9f',
  })
  for: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5f9b3b3b9d3b9f1b3b9d3b9f',
  })
  id: string;
}

export class deleteEmergencyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5f9b3b3b9d3b9f1b3b9d3b9f',
  })
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
  @ApiProperty({
    example: '5f9b3b3b9d3b9f1b3b9d3b9f',
  })
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
  @ApiProperty({
    example: '5f9b3b3b9d3b9f1b3b9d3b9f',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '5f9b3b3b9d3b9f1b3b9d3b9f',
  })
  rescuer: string;
}

export class finishEmergencyDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
