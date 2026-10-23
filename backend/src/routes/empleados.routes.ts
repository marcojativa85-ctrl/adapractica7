import express from 'express';
import { EmpleadosController } from '../controllers/empleados.controllers';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validateBody, validateParams } from '../middlewares/validation.middleware';
import { empleadoCreateSchema, empleadoIdSchema, empleadoUpdateSchema } from '../dto/empleado.dto';
import { empleadoRepository } from '../repositories/empleado.repository';

const router = express.Router();
const empleadoController = new EmpleadosController(empleadoRepository);

router.get('/empleados', asyncHandler(empleadoController.getEmpleado));
router.get('/empleados/:id', validateParams(empleadoIdSchema), asyncHandler(empleadoController.getEmpleadoById));
router.post('/empleados', validateBody(empleadoCreateSchema), asyncHandler(empleadoController.addEmpleado));
router.put('/empleados/:id', validateParams(empleadoIdSchema), validateBody(empleadoUpdateSchema), asyncHandler(empleadoController.updateEmpleado));
router.delete('/empleados/:id', validateParams(empleadoIdSchema), asyncHandler(empleadoController.deleteEmpleado));

export default router;