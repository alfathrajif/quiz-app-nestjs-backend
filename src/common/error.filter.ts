import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Catch(HttpException, UnauthorizedException, NotFoundException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception instanceof UnauthorizedException) {
      response.status(exception.getStatus()).json({
        message: 'Unauthorized',
        error: exception.message,
        timestamp: new Date().toISOString(),
        status_code: exception.getStatus(),
      });
    }
    if (exception instanceof NotFoundException) {
      response.status(exception.getStatus()).json({
        message: 'Not Found',
        error: exception.message,
        timestamp: new Date().toISOString(),
        status_code: exception.getStatus(),
      });
    }
  }
}
