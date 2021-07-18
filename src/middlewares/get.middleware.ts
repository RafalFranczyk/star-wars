import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { setValueOnQueryPageAndLimit } from '../helpers/setValueOnQuery';

@Injectable()
export class GetMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    req.query.page = setValueOnQueryPageAndLimit(req.query.page);
    req.query.limit = setValueOnQueryPageAndLimit(req.query.limit);
    next();
  }
}
