/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Prisma } from 'src/generated/prisma/client';
import { ErrorCodes } from '../errors/error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // Let Prisma filter handle Prisma Known errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const requestId = (req as any).requestId as string | undefined;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = ErrorCodes.INTERNAL_ERROR;
    let message = 'Internal server error';
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        message = payload;
      } else if (payload && typeof payload === 'object') {
        const p = payload as any;
        code = p.code ?? this.mapHttpStatusToCode(status);
        message = p.message ?? message;
        details = p.details;
      } else {
        code = this.mapHttpStatusToCode(status);
      }
    }

    // Enterprise logging (safe)
    const err = exception as any;
    this.logger.error(
      {
        requestId,
        method: req.method,
        path: req.url,
        status,
        code,
        message,
        // only log stack internally (not return)
        stack: err?.stack,
      },
      'Unhandled exception',
    );

    return res.status(status).json({
      success: false,
      statusCode: status,
      code,
      message,
      details,
      path: req.url,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  private mapHttpStatusToCode(status: number) {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCodes.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCodes.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCodes.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCodes.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCodes.CONFLICT;
      default:
        return ErrorCodes.INTERNAL_ERROR;
    }
  }
}
