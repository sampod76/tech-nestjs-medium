import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './error-codes';

export function mapPrismaKnownError(code: string) {
  switch (code) {
    case 'P2002': // unique constraint
      return {
        status: HttpStatus.CONFLICT,
        code: ErrorCodes.CONFLICT,
        message: 'Duplicate value',
      };

    case 'P2025': // record not found
      return {
        status: HttpStatus.NOT_FOUND,
        code: ErrorCodes.NOT_FOUND,
        message: 'Resource not found',
      };

    case 'P2003': // foreign key constraint
      return {
        status: HttpStatus.BAD_REQUEST,
        code: ErrorCodes.DB_FOREIGN_KEY,
        message: 'Invalid reference',
      };

    case 'P2000': // value too long
    case 'P2001': // record does not exist (some cases)
    case 'P2011': // null constraint violation
    case 'P2012': // missing required value
      return {
        status: HttpStatus.BAD_REQUEST,
        code: ErrorCodes.DB_INVALID_INPUT,
        message: 'Invalid input',
      };

    default:
      return {
        status: HttpStatus.BAD_REQUEST,
        code: ErrorCodes.DB_CONSTRAINT,
        message: 'Database error',
      };
  }
}
