import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '@modules/users/users.service';
import { TokenPayload } from '../interfaces/tokenPayload.interface';

const STRATEGY_NAME = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, STRATEGY_NAME) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secret'),
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findOne({ id: payload.userId });
  }
}

export const JwtAuthGuard = AuthGuard(STRATEGY_NAME);
