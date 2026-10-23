import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Empleado } from '../../../models/empleado';

@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.component.html',
  styleUrls: ['./empleado-list.component.css']
})
export class EmpleadoListComponent {
  empleadosList: Empleado[] = [];

  @Input()
  set empleados(value: Empleado[] | null | undefined) {
    this.empleadosList = Array.isArray(value) ? value : [];
  }

  @Output() editarEmpleado = new EventEmitter<Empleado>();
  @Output() eliminarEmpleado = new EventEmitter<Empleado>();

  onEditar(empleado: Empleado): void {
    this.editarEmpleado.emit(empleado);
  }

  onEliminar(empleado: Empleado): void {
    this.eliminarEmpleado.emit(empleado);
  }
}
