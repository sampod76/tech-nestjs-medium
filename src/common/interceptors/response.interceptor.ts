import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import type { Request } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const requestId = (req as any).requestId;

    return next.handle().pipe(
      map((data) => {
        // 🛡️ already wrapped? (edge case safety)
        if (data?.success === true && data?.statusCode) {
          return data;
        }

        return {
          success: true,
          statusCode:
            ctx.getResponse<Response & { statusCode: number }>()?.statusCode ||
            200,
          data,
          timestamp: new Date().toISOString(),
          requestId,
        };
      }),
    );
  }
}
