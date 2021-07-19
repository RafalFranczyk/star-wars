import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { setValueOnQueryPageAndLimit } from '../helpers/setValueOnQuery';

@Injectable()
export class GetMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    req.query.page = setValueOnQueryPageAndLimit(req.query.page);
    req.query.limit = setValueOnQueryPageAndLimit(req.query.limit);

    if (req.query.page != null && req.query.page < 1) {
      throw new BadRequestException({
        message: 'Incorrect input query values',
      });
    }

    if (req.query.limit != null && req.query.limit < 1) {
      throw new BadRequestException({
        message: 'Incorrect input query values',
      });
    }

    next();
  }
}
