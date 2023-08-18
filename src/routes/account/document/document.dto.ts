import {
  DocumentStatus,
  DocumentType,
} from '../../../database/document.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class DocumentInformation {
  @ApiProperty({
    type: String,
    required: true,
    example: new Types.ObjectId().toString(),
  })
  _id: string;

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
