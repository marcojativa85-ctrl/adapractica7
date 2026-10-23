import type { NextFunction, Request, Response } from 'express';
import { sendError, sendSuccess } from '../utils/response';
import type { IEmpleadoRepository } from '../repositories/empleado.repository.interface';

export class EmpleadosController {
  constructor(private readonly repository: IEmpleadoRepository) {}

  getEmpleado = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const empleados = await this.repository.getAll();
      sendSuccess(res, 200, 'Empleados obtenidos correctamente', empleados);
    } catch (error) {
      next(error);
    }
  };

  getEmpleadoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        sendError(res, 400, 'Falta el id del empleado', 'MISSING_ID');
        return;
      }

      const empleado = await this.repository.findById(id);
      if (!empleado) {
        sendError(res, 404, 'Empleado no encontrado', 'EMPLOYEE_NOT_FOUND');
        return;
      }

      sendSuccess(res, 200, 'Empleado obtenido correctamente', empleado);
    } catch (error) {
      next(error);
    }
  };

  addEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const empleado = await this.repository.create(req.body);
      sendSuccess(res, 201, 'Empleado guardado correctamente', empleado);
    } catch (error) {
      next(error);
    }
  };

  updateEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        sendError(res, 400, 'Falta el id del empleado', 'MISSING_ID');
        return;
      }

      const empleado = await this.repository.updateById(id, req.body);
      sendSuccess(res, 200, 'Empleado actualizado correctamente', empleado);
    } catch (error) {
      next(error);
    }
  };

  deleteEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        sendError(res, 400, 'Falta el id del empleado', 'MISSING_ID');
        return;
      }

      await this.repository.deleteById(id);
      sendSuccess(res, 200, 'Empleado eliminado correctamente');
    } catch (error) {
      next(error);
    }
  };
}
