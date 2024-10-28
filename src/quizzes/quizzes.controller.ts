import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { WebResponse } from 'src/model/web.model';
import { Quiz } from 'src/model/quiz.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
}
