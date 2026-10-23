import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { EmpleadoComponent } from './empleado.component';
import { EmployeeService } from '../../services/empleado.service';

describe('EmpleadoComponent', () => {
  let component: EmpleadoComponent;
  let fixture: ComponentFixture<EmpleadoComponent>;

  let empleadoService: jasmine.SpyObj<EmployeeService>;

  beforeEach(async () => {
    empleadoService = jasmine.createSpyObj<EmployeeService>(
      'EmployeeService',
      ['loadEmpleados', 'createEmpleado', 'updateEmpleado', 'deleteEmpleado'],
      { empleados$: of([]) }
    );
    empleadoService.loadEmpleados.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [EmpleadoComponent],
      providers: [{ provide: EmployeeService, useValue: empleadoService }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders backend validation errors as a visible alert', () => {
    empleadoService.createEmpleado.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 400,
      error: {
        success: false,
        message: 'Datos inválidos',
        error: {
          code: 'VALIDATION_ERROR',
          details: {
            formErrors: [],
            fieldErrors: {
              nombre: ['El nombre debe tener al menos 2 caracteres']
            }
          }
        }
      }
    })));

    component.onSubmitEmpleado({
      nombre: 'A',
      cargo: 'QA',
      departamento: 'IT',
      sueldo: 100
    });

    expect(component.notification).toEqual({
      type: 'error',
      title: 'No se pudo completar la operación',
      message: 'Datos inválidos',
      details: ['nombre: El nombre debe tener al menos 2 caracteres']
    });

    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('.notification-alert') as HTMLElement;
    expect(alert.classList).toContain('notification-alert-error');
    expect(alert.classList).toContain('notification-alert-visible');
    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.textContent).toContain('Datos inválidos');
    expect(alert.textContent).toContain('nombre: El nombre debe tener al menos 2 caracteres');
  });

  it('shows a connection notification when the backend cannot be reached', () => {
    empleadoService.createEmpleado.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 0
    })));

    component.onSubmitEmpleado({
      nombre: 'Ana',
      cargo: 'QA',
      departamento: 'IT',
      sueldo: 100
    });

    expect(component.notification?.message).toBe('No se pudo comunicar con el servidor.');
  });

  it('shows validation errors when the form blocks an invalid submission', () => {
    component.onFormularioInvalido(['Sueldo mensual: debe ser mayor a 0.']);

    expect(component.notification).toEqual({
      type: 'error',
      title: 'Revisa los datos ingresados',
      message: 'Corrige los siguientes campos para continuar.',
      details: ['Sueldo mensual: debe ser mayor a 0.']
    });
    expect(empleadoService.createEmpleado).not.toHaveBeenCalled();
  });

  it('shows a success notification after creating an employee', () => {
    empleadoService.createEmpleado.and.returnValue(of({
      success: true,
      message: 'Empleado guardado correctamente'
    }));

    component.onSubmitEmpleado({
      nombre: 'Ana',
      cargo: 'QA',
      departamento: 'IT',
      sueldo: 100
    });

    expect(component.notification).toEqual({
      type: 'success',
      title: 'Operación completada',
      message: 'Empleado guardado correctamente',
      details: []
    });
  });
});
