import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { WebResponse } from 'src/model/web.model';
import { ProfileResponse, UserResponse } from 'src/model/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @CurrentUser() user: UserResponse,
  ): Promise<WebResponse<ProfileResponse>> {
    const currentUser = await this.usersService.getUser({
      uuid: user.uuid,
    });

    return {
      message: 'Get Profile Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: {
        uuid: currentUser.uuid,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        role: currentUser.role,
        subscription: currentUser.subscription,
        payment_requests: currentUser.payment_requests,
      },
    };
  }
}
