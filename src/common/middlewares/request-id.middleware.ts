import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import type { AuthenticatedRequest } from 'src/modules/auth/auth.types';

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  (req as AuthenticatedRequest).requestId = requestId;

  res.setHeader('x-request-id', requestId);
  next();
}
