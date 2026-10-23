import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Empleado } from '../models/empleado';
import { EmployeeService } from './empleado.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  const url = 'http://localhost:3000/api/v1/empleados';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads employees into the read-only stream', () => {
    const empleados: Empleado[] = [
      { _id: '1', nombre: 'Ana', cargo: 'Analista', departamento: 'IT', sueldo: 1000 }
    ];
    let actual: Empleado[] | undefined;

    service.empleados$.subscribe((value) => actual = value);
    service.loadEmpleados().subscribe();

    httpMock.expectOne(url).flush({ success: true, message: 'ok', data: empleados });

    expect(actual).toEqual(empleados);
    expect(actual).not.toBe(empleados);
  });

  it('appends a created employee using a new array reference', () => {
    const existente: Empleado = {
      _id: '1', nombre: 'Ana', cargo: 'Analista', departamento: 'IT', sueldo: 1000
    };
    const nuevo: Empleado = {
      nombre: 'Luis', cargo: 'Desarrollador', departamento: 'IT', sueldo: 1200
    };
    let anterior: Empleado[] = [];
    let actual: Empleado[] = [];

    service.empleados$.subscribe((empleados) => {
      anterior = actual;
      actual = empleados;
    });
    service.loadEmpleados().subscribe();
    httpMock.expectOne(url).flush({ success: true, message: 'ok', data: [existente] });
    anterior = actual;

    service.createEmpleado(nuevo).subscribe();
    httpMock.expectOne(url).flush({
      success: true,
      message: 'created',
      data: { ...nuevo, _id: '2' }
    });

    expect(actual).toHaveSize(2);
    expect(actual[1]._id).toBe('2');
    expect(actual).not.toBe(anterior);
  });

  it('replaces an updated employee and removes a deleted employee immutably', () => {
    const existente: Empleado = {
      _id: '1', nombre: 'Ana', cargo: 'Analista', departamento: 'IT', sueldo: 1000
    };
    const actualizado: Empleado = {
      _id: '1', nombre: 'Ana', cargo: 'Líder', departamento: 'IT', sueldo: 1500
    };
    let actual: Empleado[] = [];
    service.empleados$.subscribe((empleados) => actual = empleados);
    service.loadEmpleados().subscribe();
    httpMock.expectOne(url).flush({ success: true, message: 'ok', data: [existente] });
    const antesDeActualizar = actual;

    service.updateEmpleado('1', actualizado).subscribe();
    const updateRequest = httpMock.expectOne(`${url}/1`);
    expect(updateRequest.request.body).toEqual({
      nombre: 'Ana',
      cargo: 'Líder',
      departamento: 'IT',
      sueldo: 1500
    });
    expect(updateRequest.request.body._id).toBeUndefined();
    updateRequest.flush({
      success: true,
      message: 'updated',
      data: actualizado
    });

    expect(actual).not.toBe(antesDeActualizar);
    expect(actual[0].cargo).toBe('Líder');
    const antesDeEliminar = actual;

    service.deleteEmpleado('1').subscribe();
    httpMock.expectOne(`${url}/1`).flush({ success: true, message: 'deleted' });

    expect(actual).not.toBe(antesDeEliminar);
    expect(actual).toEqual([]);
  });
});
