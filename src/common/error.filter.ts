import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const message = exception.message || 'Unexpected error occurred';

    const errorResponse = {
      message,
      error: exception.name,
      timestamp: new Date().toISOString(),
      status_code: status,
    };

    response.status(status).json(errorResponse);
  }
}
