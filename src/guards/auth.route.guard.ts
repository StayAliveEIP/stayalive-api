import {
  CanActivate,
  ExecutionContext,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../database/rescuer.schema';
import { Model, Types } from 'mongoose';
import { Document, DocumentStatus } from '../database/document.schema';
import { JwtStrategy } from './jwt.strategy';

export enum AccountType {
  ADMIN = 'admin',
  RESCUER = 'rescuer',
  CALL_CENTER = 'callCenter',
}

@Injectable()
export class RescuerAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user || user.account !== AccountType.RESCUER) {
      throw (
        err ||
        new UnauthorizedException(
          "Vous n'êtes pas autorisé à accéder à cette ressource avec ce type de compte.",
        )
      );
    }
    return user;
  }
}

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user || user.account !== AccountType.ADMIN) {
      throw (
        err ||
        new UnauthorizedException(
          "Vous n'êtes pas autorisé à accéder à cette ressource avec ce type de compte.",
        )
      );
    }
    return user;
  }
}

@Injectable()
export class CallCenterAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user || user.account !== AccountType.CALL_CENTER) {
      throw (
        err ||
        new UnauthorizedException(
          "Vous n'êtes pas autorisé à accéder à cette ressource avec ce type de compte.",
        )
      );
    }
    return user;
  }
}

@Injectable()
export class RescuerDocumentGuard implements CanActivate {
  constructor(
    @InjectModel(Document.name) private documentModel: Model<Document>,
  ) {}

  handleRequest(err, user) {
    console.log('user handle', user);
    if (err || !user) {
      throw err || new UnauthorizedException('Utilisateur non autorisé.');
    }
    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const authHeader = context.switchToHttp().getRequest()
    //   .headers.authorization;
    // if (!authHeader) {
    //   throw new UnauthorizedException(
    //     'Veuillez vous connecter pour accéder à cette ressource.',
    //   );
    // }
    // const token = authHeader.split(' ')[1];
    // if (!token) {
    //   throw new UnauthorizedException(
    //     "Token non trouvé dans l'en-tête de la requête.",
    //   );
    // }
    // // Decode the second part of baerer token to get the user id
    // const secondPart = token.split('.')[1];
    // const jwtPayload = Buffer.from(secondPart, 'base64').toString();
    // const userIdStr = JSON.parse(jwtPayload).id;
    // if (!userIdStr) {
    //   throw new UnauthorizedException(
    //     "L'id de l'utilisateur n'a pas pu être trouvé dans le token.",
    //   );
    // }
    // const userId = new Types.ObjectId(userIdStr);
    // const documentsValidated = await this.hasDocumentValidated(userId);
    // if (!documentsValidated) {
    //   throw new HttpException(
    //     'Veuillez valider tous vos documents avant de continuer.',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
    return true;
  }

  async hasDocumentValidated(userId: Types.ObjectId) {
    let documentsValidated = true;
    for (const docType of Object.values(DocumentStatus)) {
      const docInDB: Document | undefined = await this.documentModel.findOne({
        user: userId,
        type: docType,
        status: DocumentStatus.VALID,
      });
      if (!docInDB) {
        documentsValidated = false;
        break;
      }
    }
    return documentsValidated;
  }
}
