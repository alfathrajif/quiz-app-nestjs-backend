import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/model/auth.model';
import { QuizAttemptPayload, QuizEvaluation } from 'src/model/quiz.model';
import { WebResponse } from 'src/model/web.model';
import { AnswersService } from 'src/answers/answers.service';

@Controller('quiz-attempts')
export class AttemptsController {
  constructor(
    private readonly attemptsService: AttemptsService,
    private readonly answersService: AnswersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: TokenPayload,
    @Body() body: QuizAttemptPayload,
  ): Promise<WebResponse<QuizEvaluation>> {
    const newAttempt = await this.attemptsService.create(user.user_uuid, body);
    await this.answersService.create(newAttempt.uuid, body.selected_choices);
    const currentAttempt = await this.attemptsService.findOne(
      user.user_uuid,
      newAttempt.uuid,
    );

    return {
      message: 'Create Evaluation Succeed',
      success: true,
      status_code: HttpStatus.CREATED,
      data: currentAttempt,
    };
  }

  @Get('/:uuid')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAttempt(
    @CurrentUser() user: TokenPayload,
    @Param('uuid') uuid: string,
  ): Promise<WebResponse<QuizEvaluation>> {
    const attempt = await this.attemptsService.findOne(user.user_uuid, uuid);

    return {
      message: 'Get Evaluation Succeed',
      success: true,
      status_code: HttpStatus.CREATED,
      data: attempt,
    };
  }
}
