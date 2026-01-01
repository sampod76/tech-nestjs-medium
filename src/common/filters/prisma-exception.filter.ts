import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import type { Request, Response } from 'express';
import { mapPrismaKnownError } from '../errors/prisma-error.map';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const mapped = mapPrismaKnownError(exception.code);

    return res.status(mapped.status).json({
      success: false,
      statusCode: mapped.status,
      code: mapped.code,
      message: mapped.message,
      details: {
        prismaCode: exception.code,
        meta: exception.meta,
      },
      path: req.url,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId,
    });
  }
}
