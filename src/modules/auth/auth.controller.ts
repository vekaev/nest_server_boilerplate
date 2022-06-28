import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { User, UsersService } from '@modules/users';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local.strategy';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthLoginDto } from './dto/auth-email-login.dto';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { JwtRefreshAuthGuard } from './strategies/jwt-refresh-token.strategy';
import { JwtAuthGuard } from './strategies/jwt.strategy';
import { GetUser } from '@utils';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: AuthRegisterLoginDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: AuthLoginDto })
  @HttpCode(200)
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const { token: accessToken } = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [refreshTokenCookie]);

    return { user, accessToken, refreshToken };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  authenticate(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(200)
  async logout(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const { token: accessToken } = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    return { accessToken };
  }
}
