import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserResponse } from 'src/model/user.model';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import {
  SignupRequest,
  SignupResponse,
  TokenPayload,
} from 'src/model/auth.model';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PlansService } from 'src/subscriptions/plans/plans.service';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly plansService: PlansService,
    private readonly subcriptionsService: SubscriptionsService,
    private readonly jwtService: JwtService,
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
      const name = `${user.first_name} ${user.last_name}`;
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await this.usersService.createUser({
        name,
        email: user.email,
        password: hashedPassword,
        role: 'user',
        phone: user.phone,
      });

      const plan = await this.plansService.findOne('basic');
      await this.subcriptionsService.create({
        user_uuid: newUser.uuid,
        subscription_plan_uuid: plan.uuid,
        end_date: new Date(new Date().setDate(new Date().getDate() + 100_000)),
        started_date: new Date(),
        status: 'active',
      });

      return {
        uuid: newUser.uuid,
        name: newUser.name,
        email: newUser.email,
      };
    } catch (err) {
      console.log(err);
      throw new HttpException('Something when wrong!', 500);
    }
  }

  async verifyUser(email: string, password: string): Promise<UserResponse> {
    try {
      const user = await this.usersService.getUser({ email });
      if (!user) return null;

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return null;

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

  // Utilities function <--------------------------------------------

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
}
