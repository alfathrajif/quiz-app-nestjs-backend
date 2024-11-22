import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { z } from 'zod';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { ServeStaticModule } from '@nestjs/serve-static';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development.local', 'staging.local', 'production.local'])
    .default('development.local'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3001'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  COOKIE_NAME: z.string(),
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development.local'}`,
      validate: (config) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          console.error('Invalid environment variables:', result.error.errors);
          throw new Error('Invalid environment configuration');
        }
        return result.data;
      },
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: 'public',
    }),
  ],
  providers: [PrismaService, { provide: APP_FILTER, useClass: ErrorFilter }],
  exports: [PrismaService],
})
export class CommonModule {}
