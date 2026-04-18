import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import type { Response } from 'express';
import type { AuthenticatedRequest } from 'src/modules/auth/auth.types';

type ApiResponseEnvelope = {
  success?: boolean;
  statusCode?: number;
  data?: unknown;
  meta?: unknown;
};

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<AuthenticatedRequest>();
    const res = ctx.getResponse<Response>();

    const requestId = req.requestId;

    return next.handle().pipe(
      map((data: unknown) => {
        const response = data as ApiResponseEnvelope | null | undefined;

        // ✅ Already formatted → return as is
        if (response?.success === true && response.statusCode) {
          return data;
        }

        // ✅ Safe extraction
        const safeData =
          typeof data === 'object' && data !== null && 'items' in data
            ? (data as { items: unknown }).items
            : data;

        const safeMeta =
          typeof data === 'object' && data !== null && 'meta' in data
            ? (data as { meta: unknown }).meta
            : undefined;

        return {
          success: true,
          statusCode: res.statusCode || 200,
          message: 'Request successful',
          data: safeData,
          meta: safeMeta,
          timestamp: new Date().toISOString(),
          requestId,
        };
      }),
    );
  }
}
