import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Empleado } from '../models/empleado';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly URL_API = 'http://localhost:3000/api/v1/empleados';
  private readonly empleadosSubject = new BehaviorSubject<Empleado[]>([]);
  readonly empleados$: Observable<Empleado[]> = this.empleadosSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  loadEmpleados(): Observable<Empleado[]> {
    return this.http.get<ApiResponse<Empleado[]>>(this.URL_API).pipe(
      map((response) => response.data ?? []),
      tap((empleados) => this.empleadosSubject.next([...empleados]))
    );
  }

  createEmpleado(empleado: Empleado): Observable<ApiResponse<Empleado>> {
    return this.http.post<ApiResponse<Empleado>>(this.URL_API, empleado).pipe(
      tap(({ data }) => {
        const empleadoCreado = data ?? empleado;
        this.empleadosSubject.next([...this.empleadosSubject.value, empleadoCreado]);
      })
    );
  }

  updateEmpleado(id: string, empleado: Empleado): Observable<ApiResponse<Empleado>> {
    const payload: Pick<Empleado, 'nombre' | 'cargo' | 'departamento' | 'sueldo'> = {
      nombre: empleado.nombre,
      cargo: empleado.cargo,
      departamento: empleado.departamento,
      sueldo: empleado.sueldo
    };

    return this.http.put<ApiResponse<Empleado>>(`${this.URL_API}/${id}`, payload).pipe(
      tap(({ data }) => {
        const empleadoActualizado = data ?? { ...empleado, _id: id };
        this.empleadosSubject.next(
          this.empleadosSubject.value.map((actual) =>
            actual._id === id ? empleadoActualizado : actual
          )
        );
      })
    );
  }

  deleteEmpleado(id: string): Observable<ApiResponse<never>> {
    return this.http.delete<ApiResponse<never>>(`${this.URL_API}/${id}`).pipe(
      tap(() => {
        this.empleadosSubject.next(
          this.empleadosSubject.value.filter((empleado) => empleado._id !== id)
        );
      })
    );
  }
}