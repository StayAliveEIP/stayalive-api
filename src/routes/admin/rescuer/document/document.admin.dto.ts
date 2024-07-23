import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  DocumentStatus,
  DocumentType,
} from '../../../../database/document.schema';
import { Types } from 'mongoose';

export class DocumentRescuerAdminChangeStatusRequest {
  @ApiProperty({
    type: String,
    description: 'Document id',
    example: '60b8a3d7e4e0a40015f1f5f2',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    type: String,
    description: 'Document status',
    example: DocumentStatus.VALID,
  })
  newStatus: string;
}

export class DocumentRescuerAdminInfoDataResponse {
  @ApiProperty({
    type: String,
    required: true,
    example: new Types.ObjectId().toString(),
  })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    example: Object.keys(DocumentType).sort(() => Math.random() - 0.5)[0],
    enum: Object.keys(DocumentType),
  })
  documentType: DocumentType;

  @ApiProperty({
    type: String,
    required: true,
    example: Object.keys(DocumentStatus).sort(() => Math.random() - 0.5)[0],
    enum: Object.keys(DocumentStatus),
  })
  status: DocumentStatus;

  @ApiProperty({
    type: String,
    required: true,
    nullable: true,
    example:
      'Your ID card was refused because your provide a photo in bad quality.',
  })
  message: string | null;

  @ApiProperty({
    type: String,
    required: true,
    nullable: true,
    example: new Date().toISOString(),
  })
  lastUpdate: Date | null;
}

export class DocumentRescuerAdminInfoResponse {
  @ApiProperty({
    type: String,
    required: true,
    example: DocumentType.RESCUER_CERTIFICATE,
  })
  type: DocumentType;

  @ApiProperty({
    type: Object,
    required: true,
    nullable: true,
    example: {
      id: new Types.ObjectId().toString(),
      documentType: Object.keys(DocumentType).sort(
        () => Math.random() - 0.5,
      )[0],
      status: Object.keys(DocumentStatus).sort(() => Math.random() - 0.5)[0],
      message:
        'Your ID card was refused because your provide a photo in bad quality.',
      lastUpdate: new Date().toISOString(),
    },
  })
  data: DocumentRescuerAdminInfoDataResponse | null;
}
