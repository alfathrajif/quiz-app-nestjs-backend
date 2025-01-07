import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersUserModule } from 'src/users/user/users-user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SubscriptionPlansUserModule } from 'src/subscription-plans/user/subscription-plans-user.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { LogsModule } from 'src/payments/logs/logs.module';

@Module({
  imports: [
    SubscriptionPlansUserModule,
    SubscriptionsModule,
    UsersUserModule,
    ConfigModule,
    LogsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
