import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/model/auth.model';
import { WebResponse } from 'src/model/web.model';
import { UserResponse } from 'src/model/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @CurrentUser() user: TokenPayload,
  ): Promise<WebResponse<UserResponse>> {
    const currentUser = await this.usersService.getUser({
      uuid: user.user_uuid,
    });

    return {
      message: 'Get Profile Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: {
        uuid: currentUser.uuid,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
    };
  }
}
