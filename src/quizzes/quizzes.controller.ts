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
import { QuizzesService } from './quizzes.service';
import { WebResponse } from 'src/model/web.model';
import { CreateQuiz, Quiz, UpdateQuiz } from 'src/model/quiz.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserResponse } from 'src/model/user.model';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getQuizzes(
    @Query('section_slug') sectionSlug: string,
  ): Promise<WebResponse<Quiz[]>> {
    const quizzes = await this.quizzesService.findAll(sectionSlug);

    return {
      message: 'Get Quizzes Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: quizzes,
    };
  }

  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getQuiz(@Param('slug') slug: string): Promise<WebResponse<Quiz>> {
    const quiz = await this.quizzesService.findOne(slug);

    return {
      message: 'Get Quizzes Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: quiz,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createQuiz(
    @CurrentUser() user: UserResponse,
    @Body() quiz: CreateQuiz,
  ): Promise<WebResponse<Quiz>> {
    const newQuiz = await this.quizzesService.create(user.uuid, quiz);

    return {
      message: 'Create Quiz Succeed',
      success: true,
      status_code: HttpStatus.CREATED,
      data: newQuiz,
    };
  }

  @Patch('/:uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateQuiz(@Param('uuid') uuid: string, @Body() quiz: UpdateQuiz) {
    const updatedQuiz = await this.quizzesService.update(uuid, quiz);

    return {
      message: 'Update Quiz Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: updatedQuiz,
    };
  }

  @Put('/:uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async softDeleteQuiz(
    @Param('uuid') uuid: string,
  ): Promise<WebResponse<null>> {
    await this.quizzesService.softDelete(uuid);

    return {
      message: 'Soft Delete Quiz Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: null,
    };
  }
}
