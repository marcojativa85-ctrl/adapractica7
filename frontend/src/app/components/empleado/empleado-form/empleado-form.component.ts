import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Empleado } from '../../../models/empleado';

@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.component.html',
  styleUrls: ['./empleado-form.component.css']
})
export class EmpleadoFormComponent {
  @Input() empleado: Empleado = {
    nombre: '',
    cargo: '',
    departamento: '',
    sueldo: 0
  };

  @Output() submitEmpleado = new EventEmitter<Empleado>();
  @Output() formularioInvalido = new EventEmitter<string[]>();
  @Output() nuevoEmpleado = new EventEmitter<void>();

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      form.control.markAllAsTouched();
      this.formularioInvalido.emit(this.obtenerErrores(form));
      return;
    }

    this.submitEmpleado.emit({ ...this.empleado });
  }

  private obtenerErrores(form: NgForm): string[] {
    const labels: Record<string, string> = {
      nombre: 'Nombre completo',
      cargo: 'Cargo',
      departamento: 'Departamento',
      sueldo: 'Sueldo mensual'
    };

    return Object.entries(form.controls).flatMap(([name, control]) => {
      const label = labels[name] ?? name;
      const errors = control.errors;

      if (errors?.['required']) {
        return [`${label}: este campo es obligatorio.`];
      }
      if (errors?.['minlength']) {
        return [`${label}: debe tener al menos 2 caracteres.`];
      }
      if (errors?.['min']) {
        return [`${label}: debe ser mayor a 0.`];
      }

      return [];
    });
  }
}
