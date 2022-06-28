import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { appConfig, authConfig, databaseConfig } from './configs';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig, databaseConfig, authConfig],
      envFilePath: ['.env'],
    }),
  ],
})
export class ConfigModule {}
