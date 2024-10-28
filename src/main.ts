import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  const clientUrl = configService.get('CLIENT_URL');

  app.useLogger(app.get(Logger));
  app.enableCors({ origin: clientUrl, credentials: true });

  app.use(cookieParser());
  await app.listen(port);

  console.log(`Application is shared on: ${clientUrl}`);
  console.debug(`This application is running on: ${await app.getUrl()}`);
}
bootstrap();
