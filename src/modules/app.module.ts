import { Module } from '@nestjs/common';

import { AppController } from './app/app.controller';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule, DatabaseModule, AuthModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
