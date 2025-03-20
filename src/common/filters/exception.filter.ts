import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      console.log(' exception.getStatus()', exception.getStatus());
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        const errorResponse = responseBody as { message?: string | string[] };
        message = Array.isArray(errorResponse.message)
          ? errorResponse.message.join(', ')
          : errorResponse.message || message;
      } else {
        this.logger.error(
          `Internal Server Error: ${exception instanceof Error ? exception.stack : exception}`,
        );
      }
    }

    // Log the error
    this.logger.error(
      `Error: ${JSON.stringify({ status, message, path: request.url, method: request.method })}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
