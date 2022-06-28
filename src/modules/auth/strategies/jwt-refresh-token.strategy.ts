import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { UsersService } from '@modules/users';
import { TokenPayload } from '../interfaces/tokenPayload.interface';

const STRATEGY_NAME = 'jwt-refresh-token';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_NAME,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Refresh,
      ]),
      secretOrKey: configService.get('auth.secret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );
  }
}

export const JwtRefreshAuthGuard = AuthGuard(STRATEGY_NAME);
