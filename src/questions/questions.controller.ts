import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { WebResponse } from 'src/model/web.model';
import { Question } from 'src/model/question.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getQuestions(): Promise<WebResponse<Question[]>> {
    const questions = await this.questionsService.findAll();

    return {
      message: 'Get Questions Succeed',
      success: true,
      status_code: HttpStatus.OK,
      data: questions,
    };
  }
}
