import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/model/auth.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookieName = configService.get('COOKIE_NAME');
          return request?.cookies?.[cookieName];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.usersService.getUser({ uuid: payload.user_uuid });

    return {
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
