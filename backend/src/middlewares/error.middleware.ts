import type { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/response';

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';
  const code = error.code || 'INTERNAL_SERVER_ERROR';

  sendError(res, statusCode, message, code, error.details || error);
};
