import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../../../database/admin.schema';
import { Model, Types } from 'mongoose';
import { CallCenter } from '../../../database/callCenter.schema';
import {
  CallCenterInfoDto,
  DeleteCallCenterRequest,
  NewCallCenterRequest,
  PatchCallCenterRequest,
} from './callCenter.admin.dto';
import { SuccessMessage } from '../../../dto.dto';
import { hashPassword, randomPassword } from '../../../utils/crypt.utils';
import { ReactEmailService } from '../../../services/react-email/react-email.service';

@Injectable()
export class CallCenterAdminService {
  private readonly logger: Logger = new Logger(CallCenterAdminService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(CallCenter.name) private callCenterModel: Model<CallCenter>,
    private readonly reactEmailService: ReactEmailService,
  ) {}

  async all(): Promise<Array<CallCenterInfoDto>> {
    const callCenters = await this.callCenterModel.find();
    return callCenters.map((callCenter) => {
      return {
        id: callCenter.id,
        name: callCenter.name,
        phone: callCenter.phone,
        email: {
          email: callCenter.email.email,
          verified: callCenter.email.verified,
          lastCodeSent: callCenter.email.lastCodeSent,
        },
        address: {
          zip: callCenter.address.zip,
          city: callCenter.address.city,
          street: callCenter.address.street,
        },
      };
    });
  }

  async new(body: NewCallCenterRequest): Promise<SuccessMessage> {
    const email = body.email;
    // Check if the email is already used
    const admin = await this.callCenterModel.findOne({ 'email.email': email });
    if (admin) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }
    const plainPassword = randomPassword();
    const hashedPassword = hashPassword(plainPassword);
    // Create a new admin
    const callCenterObj: CallCenter = {
      _id: new Types.ObjectId(),
      name: body.name,
      phone: body.phone,
      profilePictureUrl: null,
      email: {
        email: email,
        verified: false,
        lastCodeSent: null,
        code: null,
      },
      password: {
        password: hashedPassword,
        lastChange: null,
        lastTokenSent: null,
        token: null,
      },
      address: {
        zip: body.address.zip,
        city: body.address.city,
        street: body.address.street,
      },
    };
    const result = await this.callCenterModel.create(callCenterObj);
    if (!result) {
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création du compte.',
      );
    }
    this.reactEmailService.sendMailCreatedAccountPassword(
      email,
      body.name,
      plainPassword,
    );
    return {
      message: 'Le compte a été créé avec succès.',
    };
  }

  async delete(body: DeleteCallCenterRequest): Promise<SuccessMessage> {
    const id = body.id;
    // Check if the id is a valid object id
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException("Mauvais format d'id.");
    }
    // Check if the call center exists
    const callCenter = await this.callCenterModel.findById(
      new Types.ObjectId(id),
    );
    if (!callCenter) {
      throw new NotFoundException("Le centre d'appel n'a pas pu être trouvé.");
    }
    // Delete the call center
    const result = await this.callCenterModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
    if (result.deletedCount === 0) {
      throw new InternalServerErrorException(
        "Une erreur est survenue lors de la suppression du centre d'appel.",
      );
    }
    return {
      message: "Le centre d'appel a été supprimé avec succès.",
    };
  }

  async info(id: string): Promise<CallCenterInfoDto> {
    // verify if the id is a valid object id
    if (!Types.ObjectId.isValid(id)) {
      throw new UnprocessableEntityException(
        "Le format de l'id n'est pas valide.",
      );
    }
    // Find the call center in the database
    const callCenter = await this.callCenterModel.findById(
      new Types.ObjectId(id),
    );
    if (!callCenter) {
      throw new NotFoundException("Le centre d'appel n'a pas pu être trouvé.");
    }
    return {
      id: callCenter.id,
      name: callCenter.name,
      phone: callCenter.phone,
      email: {
        email: callCenter.email.email,
        verified: callCenter.email.verified,
        lastCodeSent: callCenter.email.lastCodeSent,
      },
      address: {
        zip: callCenter.address.zip,
        city: callCenter.address.city,
        street: callCenter.address.street,
      },
    };
  }

  async updateCallCenterInfo(
    body: PatchCallCenterRequest,
  ): Promise<SuccessMessage> {
    const { id, ...updateData } = body;

    // Check if the id is a valid object id
    if (!Types.ObjectId.isValid(id)) {
      throw new UnprocessableEntityException(
        "Le format de l'id n'est pas valide.",
      );
    }

    // Check if the call center exists
    const callCenter = await this.callCenterModel.findById(
      new Types.ObjectId(id),
    );
    if (!callCenter) {
      throw new NotFoundException("Le centre d'appel n'a pas pu être trouvé.");
    }

    const email = {
      email: updateData.email,
      verified: false,
      lastCodeSent: null,
      code: null,
    };

    const modifiedCallCenter = {
      ...callCenter,
      name: updateData.name,
      phone: updateData.phone,
      email: email,
      address: {
        zip: updateData.address.zip,
        city: updateData.address.city,
        street: updateData.address.street,
      },
    };

    // Update the call center
    const updated = await this.callCenterModel.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        name: modifiedCallCenter.name,
        phone: modifiedCallCenter.phone,
        email: modifiedCallCenter.email,
        address: {
          zip: modifiedCallCenter.address.zip,
          city: modifiedCallCenter.address.city,
          street: modifiedCallCenter.address.street,
        },
      },
    );

    if (!updated) {
      throw new InternalServerErrorException(
        "Une erreur est survenue lors de la mise à jour des informations du centre d'appel.",
      );
    }

    return {
      message:
        "Les informations du centre d'appel ont été mises à jour avec succès.",
    };
  }
}
