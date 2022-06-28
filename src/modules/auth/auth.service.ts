import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

import { UsersService, User } from '@modules/users';
import { Role } from '@modules/roles/entities/role.entity';
import { RoleEnum } from '@modules/roles/roles.enum';
import { Status } from '@modules/statuses/entities/status.entity';
import { StatusEnum } from '@modules/statuses/statuses.enum';

import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { TokenPayload } from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  register(dto: AuthRegisterLoginDto): Promise<User> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    return this.usersService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user,
      } as Role,
      status: {
        id: StatusEnum.inactive,
      } as Status,
      hash,
    });

    //  TODO: add email verification
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.findOne({ email });

      await this.verifyPassword(plainTextPassword, user.password);

      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtAccessToken(
    userId: number,
    isSecondFactorAuthenticated = false,
  ) {
    const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.secret'),
      expiresIn: `${this.configService.get('auth.accessTokenExpiresIn')}`,
    });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'auth.accessTokenExpiresIn',
    )}`;

    return {
      token,
      cookie,
    };
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const expiresIn = this.configService.get('auth.refreshTokenExpiresIn');
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.secret'),
      expiresIn,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;

    return {
      cookie,
      token,
    };
  }

  public getCookiesForLogOut() {
    return [
      // 'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('auth.secret'),
    });
    if (payload.userId) {
      return this.usersService.findOne({ id: payload.userId });
    }
  }
}
