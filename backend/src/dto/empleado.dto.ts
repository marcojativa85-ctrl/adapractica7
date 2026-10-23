import { z } from 'zod';

export const empleadoCreateSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  cargo: z.string().min(2, 'El cargo debe tener al menos 2 caracteres'),
  departamento: z.string().min(2, 'El departamento debe tener al menos 2 caracteres'),
  sueldo: z.number().positive('El sueldo debe ser mayor a 0')
}).strict();

export const empleadoUpdateSchema = empleadoCreateSchema.partial();

export const empleadoIdSchema = z.object({
  id: z.string().min(1, 'El id es obligatorio').regex(/^[a-fA-F0-9]{24}$/, 'El id debe ser un ObjectId válido')
});

export type EmpleadoCreateDTO = z.infer<typeof empleadoCreateSchema>;
export type EmpleadoUpdateDTO = z.infer<typeof empleadoUpdateSchema>;
export type EmpleadoIdDTO = z.infer<typeof empleadoIdSchema>;
