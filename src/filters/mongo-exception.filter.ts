import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.code == 11000 ? 409 : 400;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString().split('.')[0] + 'Z',
      path: request.url,
      method: request.method,
      response: {
        message: exception.message,
      },
    });
  }
}
