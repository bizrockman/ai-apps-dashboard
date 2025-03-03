export interface BaseDAO<T, CreateDTO, UpdateDTO> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: CreateDTO): Promise<T>;
  update(data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<boolean>;
}