import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  // POSTGRES_HOST: Joi.string().required(),
  // POSTGRES_PORT: Joi.number().required(),
  // POSTGRES_USER: Joi.string().required(),
  // POSTGRES_PASSWORD: Joi.string().required(),
  // POSTGRES_DB: Joi.string().required(),
  // url: process.env.DATABASE_URL,
  name: process.env.DATABASE_NAME,
  type: process.env.DATABASE_TYPE || 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' || true,
  // maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 100,
  // sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
  // rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
  // ca: process.env.DATABASE_CA,
  // key: process.env.DATABASE_KEY,
  // cert: process.env.DATABASE_CERT,
}));
