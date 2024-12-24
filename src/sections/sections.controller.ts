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
  Query,
  UseGuards,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import { WebResponse } from 'src/model/web.model';
import { CreateSection, Section } from 'src/model/section.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TokenPayload } from 'src/model/auth.model';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSectionsInTryout(
    @Query('tryout_slug') tryoutSlug: string,
  ): Promise<WebResponse<Section[]>> {
    const sections = await this.sectionsService.findAll(tryoutSlug);

    return {
      message: 'Sections retrieved',
      success: true,
      status_code: HttpStatus.OK,
      data: sections,
    };
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getSection(@Param('slug') slug: string): Promise<WebResponse<Section>> {
    const section = await this.sectionsService.findOne(slug);

    return {
      message: 'Section retrieved',
      success: true,
      status_code: HttpStatus.OK,
      data: section,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createSection(
    @CurrentUser() user: TokenPayload,
    @Body() section: CreateSection,
  ): Promise<WebResponse<Section>> {
    const newSection = await this.sectionsService.create(
      user.user_uuid,
      section,
    );

    return {
      message: 'Section created',
      success: true,
      status_code: HttpStatus.CREATED,
      data: newSection,
    };
  }

  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async editSection(
    @Param('uuid') uuid: string,
    @Body() section: CreateSection,
  ): Promise<WebResponse<Section>> {
    const updatedSection = await this.sectionsService.update(uuid, section);

    return {
      message: 'Section updated',
      success: true,
      status_code: HttpStatus.OK,
      data: updatedSection,
    };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async softDeleteSection(
    @Param('uuid') uuid: string,
  ): Promise<WebResponse<null>> {
    await this.sectionsService.softDelete(uuid);

    return {
      message: 'Section soft deleted',
      success: true,
      status_code: HttpStatus.OK,
      data: null,
    };
  }
}
