import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '@modules/app.module';
import { RolesRepository } from '@modules/roles/roles.repository';
import { StatusRepository } from '@modules/statuses/statuses.repository';
import { validationOptions, SerializerInterceptor } from '@utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get(`app.apiPrefix`);

  app.use(cookieParser());
  app.enableShutdownHooks();
  app.setGlobalPrefix(apiPrefix, {
    exclude: ['/'],
  });

  // TODO: move to seeds
  const rolesRepo = new RolesRepository();
  await rolesRepo.init();
  const statusRepo = new StatusRepository();
  await statusRepo.init();

  app.useGlobalInterceptors(new SerializerInterceptor());
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(apiPrefix, app, document);

  const port = configService.get('app.port');

  await app.listen(port);
}

bootstrap().catch(console.error);
