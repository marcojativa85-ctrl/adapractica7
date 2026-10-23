import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EmpleadosController } from './empleados.controllers';
import type { IEmpleadoRepository } from '../repositories/empleado.repository.interface';

describe('Pruebas unitarias aisladas: EmpleadosController', () => {
  let controller: EmpleadosController;
  let mockRepository: jest.Mocked<IEmpleadoRepository>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.MockedFunction<Response['status']>;
  let jsonMock: jest.MockedFunction<Response['json']>;
  let nextMock: jest.Mock<(error?: unknown) => void>;

  const employeeId = '507f1f77bcf86cd799439011';
  const fakeEmployee = {
    _id: employeeId,
    nombre: 'Andrés Mendoza',
    cargo: 'Arquitecto',
    departamento: 'TI',
    sueldo: 4000,
  };

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    };

    controller = new EmpleadosController(mockRepository);
    jsonMock = jest.fn() as jest.MockedFunction<Response['json']>;
    statusMock = jest.fn() as jest.MockedFunction<Response['status']>;
    mockResponse = { json: jsonMock, status: statusMock };
    statusMock.mockReturnValue(mockResponse as Response);
    nextMock = jest.fn<(error?: unknown) => void>();
  });

  it('GET /empleados: devuelve la lista del repositorio con estado 200', async () => {
    const employees = [fakeEmployee];
    mockRepository.getAll.mockResolvedValue(employees);

    await controller.getEmpleado({} as Request, mockResponse as Response, nextMock);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleados obtenidos correctamente',
      data: employees,
    });
    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('GET /empleados: delega al middleware un error del repositorio', async () => {
    const error = new Error('Error de lectura');
    mockRepository.getAll.mockRejectedValue(error);

    await controller.getEmpleado({} as Request, mockResponse as Response, nextMock);

    expect(nextMock).toHaveBeenCalledWith(error);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('GET /empleados/:id: devuelve el empleado encontrado con estado 200', async () => {
    mockRepository.findById.mockResolvedValue(fakeEmployee);

    await controller.getEmpleadoById(
      { params: { id: employeeId } } as Partial<Request> as Request,
      mockResponse as Response,
      nextMock,
    );

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado obtenido correctamente',
      data: fakeEmployee,
    });
    expect(mockRepository.findById).toHaveBeenCalledWith(employeeId);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('GET /empleados/:id: responde 404 si el repositorio no encuentra al empleado', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await controller.getEmpleadoById(
      { params: { id: employeeId } } as Partial<Request> as Request,
      mockResponse as Response,
      nextMock,
    );

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: 'Empleado no encontrado',
      error: { code: 'EMPLOYEE_NOT_FOUND', details: undefined },
    });
    expect(mockRepository.findById).toHaveBeenCalledWith(employeeId);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('POST /empleados: crea el empleado y responde 201', async () => {
    mockRepository.create.mockResolvedValue(fakeEmployee);
    const request = { body: fakeEmployee } as Request;

    await controller.addEmpleado(request, mockResponse as Response, nextMock);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado guardado correctamente',
      data: fakeEmployee,
    });
    expect(mockRepository.create).toHaveBeenCalledWith(fakeEmployee);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('POST /empleados: delega al middleware un error al crear', async () => {
    const error = new Error('Error de creación');
    mockRepository.create.mockRejectedValue(error);

    await controller.addEmpleado(
      { body: fakeEmployee } as Partial<Request> as Request,
      mockResponse as Response,
      nextMock,
    );

    expect(nextMock).toHaveBeenCalledWith(error);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('PUT /empleados/:id: actualiza el empleado y responde 200', async () => {
    const updates = { cargo: 'Arquitecto principal' };
    const updatedEmployee = { ...fakeEmployee, ...updates };
    mockRepository.updateById.mockResolvedValue(updatedEmployee);

    await controller.updateEmpleado(
      { params: { id: employeeId }, body: updates } as Partial<Request> as Request,
      mockResponse as Response,
      nextMock,
    );

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado actualizado correctamente',
      data: updatedEmployee,
    });
    expect(mockRepository.updateById).toHaveBeenCalledWith(employeeId, updates);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('PUT /empleados/:id: delega al middleware un error de actualización', async () => {
    const error = new Error('Error de actualización');
    mockRepository.updateById.mockRejectedValue(error);

    await controller.updateEmpleado(
      { params: { id: employeeId }, body: { cargo: 'Arquitecto principal' } } as Partial<Request> as Request,
      mockResponse as Response,
      nextMock,
    );

    expect(nextMock).toHaveBeenCalledWith(error);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('DELETE /empleados/:id: elimina el empleado y responde 200', async () => {
    mockRepository.deleteById.mockResolvedValue(fakeEmployee);

    await controller.deleteEmpleado(
      { params: { id: employeeId } } as Partial<Request> as Request,
      mockResponse as Response,
      nextMock,
    );

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: 'Empleado eliminado correctamente',
      data: undefined,
    });
    expect(mockRepository.deleteById).toHaveBeenCalledWith(employeeId);
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('DELETE /empleados/:id: delega al middleware un error al eliminar', async () => {
    const error = new Error('Error de eliminación');
    mockRepository.deleteById.mockRejectedValue(error);

    await controller.deleteEmpleado(
      { params: { id: employeeId } } as Partial<Request> as Request,
      mockResponse as Response,
      nextMock,
    );

    expect(nextMock).toHaveBeenCalledWith(error);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });
});
