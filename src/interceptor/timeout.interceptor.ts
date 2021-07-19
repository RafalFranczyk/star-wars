import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  static TIMEOUT_RESPONSE_TIME_MS = 5000;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(TimeoutInterceptor.TIMEOUT_RESPONSE_TIME_MS),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () => new RequestTimeoutException({ message: err.message }),
          );
        }
        return throwError(() => err.message);
      }),
    );
  }
}
