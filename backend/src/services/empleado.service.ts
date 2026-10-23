import { BehaviorSubject, Observable } from 'rxjs';
import { empleadoRepository } from '../repositories/empleado.repository';
import type { IEmpleadoRepository } from '../repositories/empleado.repository.interface';

export class EmpleadoService {
  private readonly empleadosSubject = new BehaviorSubject<any[]>([]);
  readonly empleados$: Observable<any[]> = this.empleadosSubject.asObservable();

  constructor(private readonly repository: IEmpleadoRepository = empleadoRepository) {}

  async initialize(): Promise<void> {
    const empleados = await this.repository.getAll();
    this.empleadosSubject.next([...empleados]);
  }

  getCurrentEmpleados(): any[] {
    return [...this.empleadosSubject.getValue()];
  }

  async getAll(): Promise<any[]> {
    const empleados = await this.repository.getAll();
    this.empleadosSubject.next([...empleados]);
    return this.getCurrentEmpleados();
  }

  async create(data: any): Promise<any> {
    const empleado = await this.repository.create(data);
    const current = this.empleadosSubject.getValue();
    this.empleadosSubject.next([...current, empleado]);
    return empleado;
  }

  async update(id: string, data: any): Promise<any> {
    const empleado = await this.repository.updateById(id, data);
    const current = this.empleadosSubject.getValue();
    this.empleadosSubject.next(
      current.map((item) => (item._id?.toString() === id ? { ...item, ...empleado } : item))
    );
    return empleado;
  }

  async delete(id: string): Promise<void> {
    await this.repository.deleteById(id);
    const current = this.empleadosSubject.getValue();
    this.empleadosSubject.next(current.filter((item) => item._id?.toString() !== id));
  }
}

export const empleadoService = new EmpleadoService();
