import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { Injectable } from '@nestjs/common';
import { MagicLoginService } from './magiclogin.service';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly service: MagicLoginService) {
    super({
      secret: process.env.JWT_SECRET,
      jwtOptions: {
        expiresIn: '5m',
      },
      callbackUrl: process.env.MAGIC_LINK_URL + '/auth/magiclogin/callback',
      sendMagicLink: async (email, token, magicLink) => {
        // send email with magicLink
        console.log('sendMagicLink', email, token, magicLink);
      },
      verify: async (payload, callback) => {
        // verify token
        callback(null, this.validate(payload));
      },
    });
  }

  async validate(payload: any) {
    return this.service.validateUser(payload.email);
  }
}
