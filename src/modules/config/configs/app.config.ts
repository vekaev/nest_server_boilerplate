import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  workingDirectory: process.env.PWD || process.cwd(),
  frontendDomain: process.env.FRONTEND_DOMAIN,
  backendDomain: process.env.BACKEND_DOMAIN,
}));
