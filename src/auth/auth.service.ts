import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserResponse } from 'src/model/user.model';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import {
  SignupRequest,
  SignupResponse,
  TokenPayload,
} from 'src/model/auth.model';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { SubscriptionPlansUserService } from 'src/subscription-plans/user/subscription-plans-user.service';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Subscription } from 'src/model/subscription.model';
import { LogsService } from 'src/payments/logs/logs.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly SubscriptionPlansUserService: SubscriptionPlansUserService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly jwtService: JwtService,
    private readonly paymentLogsService: LogsService,
  ) {}

  async login(user: UserResponse, response: Response): Promise<UserResponse> {
    try {
      const tokenPayload = this.createTokenPayload(user);
      const token = this.generateToken(tokenPayload);
      this.setAuthCookie(response, token);

      return user;
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Login failed. Please try again later.');
    }
  }

  async signup(user: SignupRequest): Promise<SignupResponse> {
    try {
      const hashedPassword = await this.hashPassword(user.password);
      const newUser = await this.createUser(user, hashedPassword);
      await this.createSubscription(newUser.uuid);

      return {
        uuid: newUser.uuid,
        name: newUser.name,
        email: newUser.email,
      };
    } catch (error) {
      console.error('Error during signup:', error);
      throw new HttpException(
        'An error occurred during signup. Please try again.',
        500,
      );
    }
  }

  async verifyUser(
    email: string,
    password: string,
  ): Promise<UserResponse | null> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) return null;

      const isPasswordValid = await this.validatePassword(
        password,
        user.password,
      );
      if (!isPasswordValid) return null;

      return {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } catch (err) {
      console.log(err);
      throw new HttpException('Something when wrong!', 500);
    }
  }

  // Utilities function for login <--------------------------------------------

  private getTokenExpiration(): Date {
    const jwtExpiration = this.configService.get<string>('JWT_EXPIRATION');
    if (!jwtExpiration) {
      throw new Error('JWT_EXPIRATION configuration is missing.');
    }

    const expires = new Date();
    const expirationTime = ms(jwtExpiration);
    expires.setMilliseconds(expires.getMilliseconds() + expirationTime);
    return expires;
  }

  private createTokenPayload(user: UserResponse): TokenPayload {
    if (!user?.uuid) {
      throw new Error('Invalid user data. UUID is missing.');
    }

    return {
      user_uuid: user.uuid,
    };
  }

  private generateToken(payload: TokenPayload): string {
    try {
      return this.jwtService.sign(payload);
    } catch {
      throw new Error('Failed to generate JWT token.');
    }
  }

  private setAuthCookie(response: Response, token: string): void {
    const cookieName = this.configService.get<string>('COOKIE_NAME');
    if (!cookieName) {
      throw new Error('COOKIE_NAME configuration is missing.');
    }

    response.cookie(cookieName, token, {
      secure: true,
      httpOnly: true,
      expires: this.getTokenExpiration(),
    });
  }

  // Utilities function for signup <--------------------------------------------

  private async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password is required.');
    }
    try {
      return await bcrypt.hash(password, 10);
    } catch {
      throw new Error('Failed to hash password.');
    }
  }

  private async createUser(user: SignupRequest, hashedPassword: string) {
    try {
      const name = `${user.first_name} ${user.last_name}`;
      return await this.usersService.createUser({
        name,
        email: user.email,
        password: hashedPassword,
        role: 'user',
        phone: user.phone,
      });
    } catch {
      throw new Error('Failed to create user.');
    }
  }

  private async createSubscription(userUuid: string): Promise<Subscription> {
    try {
      const plan = await this.SubscriptionPlansUserService.findOne('basic');
      if (!plan) {
        throw new Error('Subscription plan not found.');
      }

      const newSubscription: Subscription =
        await this.subscriptionsService.create({
          user_uuid: userUuid,
          subscription_plan_uuid: plan.uuid,
          end_date: new Date(
            new Date().setDate(new Date().getDate() + 100_000),
          ),
          started_date: new Date(),
          status: 'active',
        });

      return newSubscription;
    } catch {
      throw new Error('Failed to create subscription.');
    }
  }

  // Utilities function for verifyUser <--------------------------------------------

  private async findUserByEmail(email: string): Promise<User> {
    if (!email) {
      throw new Error('Email is required.');
    }

    try {
      const user = await this.usersService.getUser({ email });

      if (!user) {
        console.warn(`User with email ${email} not found.`);
        return null;
      }

      return user;
    } catch {
      throw new Error('Failed to retrieve user by email.');
    }
  }

  private async validatePassword(
    inputPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    if (!inputPassword || !storedPassword) {
      throw new Error('Password is required.');
    }

    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch {
      throw new Error('Failed to validate password.');
    }
  }
}
