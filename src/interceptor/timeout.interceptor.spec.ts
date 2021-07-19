import { createMock } from '@golevelup/ts-jest';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { throwError } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';

import { TimeoutInterceptor } from './timeout.interceptor';

describe('TimeoutInterceptor', () => {
  const TIMEOUT = TimeoutInterceptor.TIMEOUT_RESPONSE_TIME_MS;
  let timeoutInterceptor: TimeoutInterceptor;

  beforeEach(() => {
    timeoutInterceptor = new TimeoutInterceptor();
  });

  it(
    `should return the data, when the request handler take less than ${TIMEOUT}ms to execute`,
    marbles((m) => {
      const ctx = createMock<ExecutionContext>();

      const expectedData = {};
      const next: CallHandler = {
        handle: () => m.cold('|', { e: expectedData }),
      };

      const handlerData$ = timeoutInterceptor.intercept(ctx, next);

      const expected$ = m.cold('|', { e: expectedData });
      m.expect(handlerData$).toBeObservable(expected$);
    }),
  );
});
