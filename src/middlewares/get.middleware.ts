import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class GetMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    req.query.page = setValueOnQueryPageAndLimit(req.query.page);
    req.query.limit = setValueOnQueryPageAndLimit(req.query.limit);
    next();
  }
}

function setValueOnQueryPageAndLimit(value: any) {
  return value != null ? (!isNaN(value) ? parseInt(value) : null) : null;
}
