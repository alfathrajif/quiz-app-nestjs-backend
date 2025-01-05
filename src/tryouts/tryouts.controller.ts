import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TryoutsService } from './tryouts.service';
import { CreateTryout, Tryout } from 'src/model/tryout.model';
import { WebResponse } from 'src/model/web.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserResponse } from 'src/model/user.model';

@Controller('tryouts')
export class TryoutsController {
  constructor(private readonly tryoutsService: TryoutsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTryouts(): Promise<WebResponse<Tryout[]>> {
    const tryouts = await this.tryoutsService.findAll();

    return {
      message: 'Tryouts retrieved',
      success: true,
      status_code: HttpStatus.OK,
      data: tryouts,
    };
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getTryout(@Param('slug') slug: string): Promise<WebResponse<Tryout>> {
    const tryout = await this.tryoutsService.findOne(slug);

    return {
      message: 'Tryout retrieved',
      success: true,
      status_code: HttpStatus.OK,
      data: tryout,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createTryout(
    @CurrentUser() user: UserResponse,
    @Body() tryout: CreateTryout,
  ): Promise<WebResponse<Tryout>> {
    const newTryout = await this.tryoutsService.create(user.uuid, tryout);

    return {
      message: 'Tryout created',
      success: true,
      status_code: HttpStatus.CREATED,
      data: newTryout,
    };
  }

  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async editTryout(
    @Param('uuid') uuid: string,
    @Body() tryout: CreateTryout,
  ): Promise<WebResponse<Tryout>> {
    const updatedTryout = await this.tryoutsService.update(uuid, tryout);

    return {
      message: 'Tryout updated',
      success: true,
      status_code: HttpStatus.OK,
      data: updatedTryout,
    };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async softDeleteTryout(
    @Param('uuid') uuid: string,
  ): Promise<WebResponse<null>> {
    await this.tryoutsService.softDelete(uuid);

    return {
      message: 'Tryout deleted',
      success: true,
      status_code: HttpStatus.OK,
      data: null,
    };
  }
}
