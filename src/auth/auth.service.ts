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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserResponse, response: Response) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.get<string>('JWT_EXPIRATION')),
    );

    const tokenPayload: TokenPayload = {
      user_uuid: user.uuid,
    };
    const token = this.jwtService.sign(tokenPayload);

    response.cookie(this.configService.get<string>('COOKIE_NAME'), token, {
      secure: true,
      httpOnly: true,
    });

    return user;
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
}
