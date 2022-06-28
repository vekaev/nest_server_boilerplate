import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { User } from '@modules/users';

const STRATEGY_NAME = 'local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGY_NAME) {
  constructor(private authenticationService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(email, password);
  }
}

export const LocalAuthGuard = AuthGuard(STRATEGY_NAME);
