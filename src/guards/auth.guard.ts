import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RescuerAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class CallCenterAuthGuard extends AuthGuard('jwt') {}
