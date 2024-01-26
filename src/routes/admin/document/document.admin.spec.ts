import { DocumentAdminController } from './document.admin.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { DocumentAdminService } from './document.admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { Emergency, EmergencySchema } from '../../../database/emergency.schema';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';
import { Admin, AdminSchema } from '../../../database/admin.schema';
import { Types } from 'mongoose';

const DocumentAllMock = {
  _id: new Types.ObjectId('60f0a9b0e6b3a5e8a4b9e0a1'),
  documentType: 'ID_CARD',
  status: 'PENDING',
  message: 'string',
  lastUpdate: '2021-07-16T14:00:00.000Z',
};

const RescuerMock = {
  _id: '60f0a9b0e6b3a5e8a4b9e0a1',
};

class DocumenModelMock {
  constructor(public data) {}

  static findOne = jest.fn().mockImplementation((query) => {
    return new DocumenModelMock(DocumentAllMock).data;
  });
}

class RescuerModelMock {
  constructor(public data) {}

  static findOne = jest.fn().mockImplementation((query) => {
    return new RescuerModelMock(RescuerMock).data;
  });
}

describe('Admin Document Controller', () => {
  let controller: DocumentAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentAdminController],
      imports: [
        // Set up the environment variables.
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI, {
          dbName: process.env.MONGODB_DATABASE,
        }),
        MongooseModule.forFeature([
          { name: Rescuer.name, schema: RescuerSchema },
          { name: Emergency.name, schema: EmergencySchema },
          { name: CallCenter.name, schema: CallCenterSchema },
          { name: Admin.name, schema: AdminSchema },
        ]),
      ],
      providers: [
        DocumentAdminService,
        ReactEmailService,
        {
          provide: 'DocumentModel',
          useValue: DocumenModelMock,
        },
        {
          provide: 'RescuerModel',
          useValue: RescuerModelMock,
        },
      ],
    }).compile();

    controller = module.get<DocumentAdminController>(DocumentAdminController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Get the documents of a rescuer', async () => {
    const result = await controller.all('60f0a9b0e6b3a5e8a4b9e0a1');
    expect(result).toEqual([
      {
        type: 'ID_CARD',
        data: {
          id: '60f0a9b0e6b3a5e8a4b9e0a1',
          documentType: undefined,
          status: 'PENDING',
          message: 'string',
          lastUpdate: '2021-07-16T14:00:00.000Z',
        },
      },
      {
        type: 'RESCUER_CERTIFICATE',
        data: {
          id: '60f0a9b0e6b3a5e8a4b9e0a1',
          documentType: undefined,
          status: 'PENDING',
          message: 'string',
          lastUpdate: '2021-07-16T14:00:00.000Z',
        },
      },
    ]);
  });
});
