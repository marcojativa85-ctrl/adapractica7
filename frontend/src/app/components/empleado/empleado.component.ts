import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../../models/empleado';
import { EmployeeService } from '../../services/empleado.service';

interface EmployeeNotification {
  type: 'success' | 'error';
  title: string;
  message: string;
  details: string[];
}

interface BackendErrorResponse {
  message?: unknown;
  error?: {
    details?: unknown;
  };
}

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
  readonly empleados$: Observable<Empleado[]>;
  empleadoSeleccionado: Empleado = this.crearEmpleadoVacio();
  notification: EmployeeNotification | null = null;

  constructor(private readonly empleadoService: EmployeeService) {
    this.empleados$ = this.empleadoService.empleados$;
  }

  ngOnInit(): void {
    this.loadEmpleados();
  }

  private crearEmpleadoVacio(): Empleado {
    return {
      nombre: '',
      cargo: '',
      departamento: '',
      sueldo: 0
    };
  }

  loadEmpleados(): void {
    this.empleadoService.loadEmpleados().subscribe({
      error: (error: unknown) => this.mostrarError(error)
    });
  }

  onSubmitEmpleado(empleado: Empleado): void {
    const empleadoPayload = { ...empleado };
    this.notification = null;

    if (empleadoPayload._id) {
      this.empleadoService.updateEmpleado(empleadoPayload._id, empleadoPayload).subscribe({
        next: (response) => {
          this.empleadoSeleccionado = this.crearEmpleadoVacio();
          this.mostrarExito(response.message || 'Empleado actualizado correctamente.');
        },
        error: (error: unknown) => this.mostrarError(error)
      });
      return;
    }

    this.empleadoService.createEmpleado(empleadoPayload).subscribe({
      next: (response) => {
        this.empleadoSeleccionado = this.crearEmpleadoVacio();
        this.mostrarExito(response.message || 'Empleado creado correctamente.');
      },
      error: (error: unknown) => this.mostrarError(error)
    });
  }

  onFormularioInvalido(details: string[]): void {
    this.notification = {
      type: 'error',
      title: 'Revisa los datos ingresados',
      message: 'Corrige los siguientes campos para continuar.',
      details
    };
  }

  onEditarEmpleado(empleado: Empleado): void {
    this.empleadoSeleccionado = { ...empleado };
  }

  onNuevoEmpleado(): void {
    this.empleadoSeleccionado = this.crearEmpleadoVacio();
  }

  cerrarNotificacion(): void {
    this.notification = null;
  }

  onEliminarEmpleado(empleado: Empleado): void {
    if (!empleado._id) {
      return;
    }
    this.notification = null;
    this.empleadoService.deleteEmpleado(empleado._id).subscribe({
      next: (response) => {
        this.mostrarExito(response.message || 'Empleado eliminado correctamente.');
      },
      error: (error: unknown) => this.mostrarError(error)
    });
  }

  private mostrarExito(message: string): void {
    this.notification = {
      type: 'success',
      title: 'Operación completada',
      message,
      details: []
    };
  }

  private mostrarError(error: unknown): void {
    const response = error instanceof HttpErrorResponse
      ? error.error as BackendErrorResponse
      : null;
    const message = typeof response?.message === 'string'
      ? response.message
      : error instanceof HttpErrorResponse
        ? 'No se pudo comunicar con el servidor.'
        : 'Ocurrió un error inesperado.';

    this.notification = {
      type: 'error',
      title: 'No se pudo completar la operación',
      message,
      details: this.extraerDetalles(response?.error?.details)
    };
  }

  private extraerDetalles(details: unknown): string[] {
    if (!details || typeof details !== 'object') {
      return [];
    }

    const validation = details as {
      fieldErrors?: Record<string, unknown>;
      formErrors?: unknown;
    };
    const fieldErrors = Object.entries(validation.fieldErrors ?? {})
      .flatMap(([field, errors]) =>
        Array.isArray(errors)
          ? errors.filter((item): item is string => typeof item === 'string')
            .map((item) => `${field}: ${item}`)
          : []
      );
    const formErrors = Array.isArray(validation.formErrors)
      ? validation.formErrors.filter((item): item is string => typeof item === 'string')
      : [];

    return [...formErrors, ...fieldErrors];
  }
}
