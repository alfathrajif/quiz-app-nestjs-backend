import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  CreateUserType,
  CurrentUserType,
  UserResponse,
} from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { AdministratorsService } from './administrators.service';

@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/administrators')
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAdministrators(
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<WebResponse<UserResponse[]>> {
    const admins = await this.administratorsService.findAll(currentUser);

    return {
      message: 'Get Administrators Succeed',
      status_code: HttpStatus.OK,
      success: true,
      data: admins,
    };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async createAdministrator(
    @CurrentUser() currentUser: CurrentUserType,
    @Body() createAdministrator: CreateUserType,
  ): Promise<WebResponse<UserResponse>> {
    const createdAdministrator = await this.administratorsService.create(
      currentUser,
      createAdministrator,
    );

    return {
      message: 'Create Administrator Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: createdAdministrator,
    };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  async softDeleteAdministrator(
    @Param('uuid') uuid: string,
  ): Promise<WebResponse<null>> {
    await this.administratorsService.softDelete(uuid);

    return {
      message: 'Soft Delete Administrator Succeed',
      success: true,
      status_code: HttpStatus.OK,
    };
  }
}
