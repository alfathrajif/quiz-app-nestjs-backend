import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersAdminService } from './users-admin.service';
import { WebResponse } from 'src/model/web.model';
import { User } from 'src/model/user.model';

@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class UsersAdminController {
  constructor(private readonly usersAdminService: UsersAdminService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<WebResponse<User[]>> {
    const users = await this.usersAdminService.findAll();

    return {
      message: 'Get Users Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: users,
    };
  }
}
