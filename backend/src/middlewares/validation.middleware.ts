import type { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/response';

export const validateSchema = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!result.success) {
        const details = result.error.flatten();
        sendError(res, 400, 'Datos inválidos', 'VALIDATION_ERROR', details);
        return;
      }

      req.body = result.data.body ?? req.body;
      req.params = result.data.params ?? req.params;
      req.query = result.data.query ?? req.query;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateBody = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.flatten();
      sendError(res, 400, 'Datos inválidos', 'VALIDATION_ERROR', details);
      return;
    }

    req.body = result.data;
    next();
  };
};

export const validateParams = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const details = result.error.flatten();
      sendError(res, 400, 'Parámetros inválidos', 'VALIDATION_ERROR', details);
      return;
    }

    req.params = result.data;
    next();
  };
};
