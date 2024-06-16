export interface RepositoryInterface {
  findOneById(id: string): Promise<any>;
  //   findAll(): Promise<any[]>;

  //   findDeletedById(id: string): Promise<any>;

  //   create(data: any): Promise<any>;
  //   update(id: string, data: any): Promise<any>;
  //   delete(id: string): Promise<any>;
}
