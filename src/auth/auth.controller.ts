import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { UserResponse } from 'src/model/user.model';
import { Response } from 'express';
import { WebResponse } from 'src/model/web.model';
import { SignupRequest, SignupResponse } from 'src/model/auth.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() user: UserResponse,
    @Res({ passthrough: true }) response: Response,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.login(user, response);

    return {
      message: 'Login succeeded',
      success: true,
      status_code: HttpStatus.OK,
      data: {
        uuid: result.uuid,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    };
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() user: SignupRequest,
  ): Promise<WebResponse<SignupResponse>> {
    const result = await this.authService.signup(user);

    return {
      message: 'Signup succeeded',
      success: true,
      status_code: HttpStatus.CREATED,
      data: result,
    };
  }
}
