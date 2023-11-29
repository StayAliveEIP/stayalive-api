import { Test, TestingModule } from '@nestjs/testing';
import { LinkController } from './link.controller';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../../validation/env.validation';
import { RedisModule } from '../../../../services/redis/redis.module';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../../database/rescuer.schema';
import { LinkService } from './link.service';
import { Link, LinkSchema } from '../../../../database/link.schema';
import { Model } from 'mongoose';

describe('LinkController', () => {
  let controller: LinkController;
  let linkModel: Model<Link>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        // Set up the environment variables.
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
        RedisModule,
        // Connect to the MongoDB database.
        MongooseModule.forRoot(process.env.MONGODB_URI, {
          dbName: process.env.MONGODB_DATABASE,
        }),
        // Get the rescuer model.
        MongooseModule.forFeature([
          { name: Rescuer.name, schema: RescuerSchema },
          { name: Link.name, schema: LinkSchema },
        ]),
      ],
      controllers: [LinkController],
      providers: [LinkService],
    }).compile();
    controller = app.get<LinkController>(LinkController);
    linkModel = app.get<Model<Link>>(getModelToken(Link.name));
  });

  it('create a link', async () => {
    const link = await controller.createLink({
      url: 'https://google.com',
      expiresAt: null,
    });
    expect(link).toStrictEqual({
      message: 'Le lien a bien été créé.',
    });
  });

  it('delete a link', async () => {
    const id = await linkModel.findOne({ url: 'https://google.com' });
    const link = await controller.deleteLink({
      id: id._id.toString(),
    });
    expect(link).toStrictEqual({
      message: 'Le lien a bien été supprimé.',
    });
  });
});
