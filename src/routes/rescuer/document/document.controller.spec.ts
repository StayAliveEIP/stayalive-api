import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import mongoose, { Types } from 'mongoose';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import {
  Document,
  DocumentSchema,
  DocumentStatus,
  DocumentType,
} from '../../../database/document.schema';
import { SuccessMessage } from '../../../dto.dto';
import { DocumentInformation } from './document.dto';
import { StreamableFile } from '@nestjs/common';
import * as Stream from 'stream';

describe('DocumentController', () => {
  let documentController: DocumentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        // Set up the environment variables.
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
        // Connect to the MongoDB database.
        MongooseModule.forRoot(process.env.MONGODB_URI, {
          dbName: process.env.MONGODB_DATABASE,
        }),
        // Get the rescuer model.
        MongooseModule.forFeature([
          { name: Rescuer.name, schema: RescuerSchema },
        ]),
        // Get the document model.
        MongooseModule.forFeature([
          { name: Document.name, schema: DocumentSchema },
        ]),
      ],
      controllers: [DocumentController],
      providers: [DocumentService],
    }).compile();
    documentController = app.get<DocumentController>(DocumentController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Upload, download and delete a document', () => {
    const userId: Types.ObjectId = new Types.ObjectId();
    const documentType: DocumentType = DocumentType.RESCUER_CERTIFICATE;
    const buffer: Buffer = Buffer.from('randomFile');

    it('Should accept the upload process', async () => {
      const file = [
        {
          buffer: buffer,
          mimetype: 'application/pdf',
        },
      ];
      // Get a random document type
      const result: SuccessMessage = await documentController.upload(
        file as Array<Express.Multer.File>,
        userId,
        documentType,
      );
      expect(result).toStrictEqual({
        message: 'Your document was successfully uploaded !',
      });
    });

    it('Should download the previous file uploaded', async () => {
      const res = {
        send: jest.fn(),
        setHeader: jest.fn(),
      };
      const streamableFile: StreamableFile = await documentController.download(
        userId,
        res as any,
        documentType,
      );
      const bufferResult: Buffer = await streamToBuffer(
        streamableFile.getStream(),
      );
      expect(bufferResult).toEqual(Buffer.from('randomFile'));
    });

    it('Should get information about the file uploaded', async () => {
      const result: DocumentInformation =
        await documentController.documentInformation(userId, documentType);
      expect(result.status).toBe(DocumentStatus.PENDING);
    });

    it('Should delete the previous file uploaded', async () => {
      const result: SuccessMessage = await documentController.delete(
        userId,
        documentType,
      );
      expect(result).toStrictEqual({
        message:
          'Your document of type' + documentType + ' was successfully deleted.',
      });
    });
  });
});

async function streamToBuffer(stream: Stream.Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    stream.on('error', (error: Error) => {
      reject(error);
    });
  });
}
