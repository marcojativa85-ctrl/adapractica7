import Empleado from '../models/empleado';
import type { IEmpleadoRepository } from './empleado.repository.interface';

class MongoEmpleadoRepository implements IEmpleadoRepository {
  async getAll(): Promise<any[]> {
    return await Empleado.find();
  }

  async findById(id: string): Promise<any | null> {
    return await Empleado.findById(id);
  }

  async create(data: any): Promise<any> {
    const empleado = new Empleado(data);
    return await empleado.save();
  }

  async updateById(id: string, data: any): Promise<any> {
    return await Empleado.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id: string): Promise<any> {
    return await Empleado.findByIdAndDelete(id);
  }
}

export const empleadoRepository: IEmpleadoRepository = new MongoEmpleadoRepository();
