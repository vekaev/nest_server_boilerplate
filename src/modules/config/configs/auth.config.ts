import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.JWT_SECRET || 'secret',
  accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '15m',
  refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '30d',
}));
