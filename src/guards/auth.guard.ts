import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
