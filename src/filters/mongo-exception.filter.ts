import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(exception.code == 11000 ? 409 : 400).json({
      mongodbStatusCode: exception.code,
      mongodbMessage: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
