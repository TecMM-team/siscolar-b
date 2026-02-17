import type { Request, Response, NextFunction } from 'express';
import { buildErrorResponse } from '../utils/responseBuilder';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Error interno del servidor';
  let errorCode = 'INTERNAL_SERVER_ERROR';
  const details: Record<string, unknown> | undefined = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.message.toUpperCase().replace(/ /g, '_');
  } else if (err instanceof Error) {
    message = err.message;
    if ('code' in err && typeof err.code === 'string') {
      errorCode = err.code;
      if (err.code === 'P1001') {
        statusCode = 500;
        message = 'No se pudo conectar a la base de datos';
      }
    }
  }

  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Algo salió muy mal!';
    errorCode = 'SERVER_ERROR';
  }
  
  res.status(statusCode).json(buildErrorResponse(errorCode, message, details));
};