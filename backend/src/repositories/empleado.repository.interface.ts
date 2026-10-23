export interface IEmpleadoRepository {
  getAll(): Promise<any[]>;
  findById(id: string): Promise<any | null>;
  create(data: any): Promise<any>;
  updateById(id: string, data: any): Promise<any>;
  deleteById(id: string): Promise<any>;
}
