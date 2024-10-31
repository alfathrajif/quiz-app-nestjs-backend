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
import { QuizzesService } from './quizzes.service';
import { WebResponse } from 'src/model/web.model';
import { CreateQuiz, Quiz, UpdateQuiz } from 'src/model/quiz.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/model/auth.model';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getQuizzes(): Promise<WebResponse<Quiz[]>> {
    const quizzes = await this.quizzesService.findAll();

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
    @CurrentUser() user: TokenPayload,
    @Body() quiz: CreateQuiz,
  ): Promise<WebResponse<Quiz>> {
    const newQuiz = await this.quizzesService.create(user.user_uuid, quiz);

    return {
      message: 'Create Quiz Succeed',
      success: true,
      status_code: HttpStatus.CREATED,
      data: newQuiz,
    };
  }

  @Put('/:slug')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateQuiz(@Param('slug') slug: string, @Body() quiz: UpdateQuiz) {
    const updatedQuiz = await this.quizzesService.update(slug, quiz);

    return {
      message: 'Update Quiz Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: updatedQuiz,
    };
  }
}
