import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export enum AccountType {
  ADMIN = 'admin',
  RESCUER = 'rescuer',
  CALL_CENTER = 'callCenter',
}

@Injectable()
export class RescuerAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class CallCenterAuthGuard extends AuthGuard('jwt') {}
