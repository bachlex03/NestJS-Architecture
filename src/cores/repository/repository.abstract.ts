import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { EntityBase } from 'src/cores/repository/entity.base';
import { RepositoryInterface } from 'src/cores/repository/repository.interface';
import { User } from 'src/modules/users/entities/user.entity';

export abstract class RepositoryAbstract<T extends EntityBase>
  implements RepositoryInterface
{
  constructor(private model: Model<T>) {}

  async findOneById(id: string): Promise<T> {
    const result = (await this.model.findById(id).lean().exec()) as T;

    return result;
  }

  async create(data: object): Promise<T> {
    let result = await this.model.create({
      ...(data as T),
    });

    return {
      ...result.toObject(),
    };
  }
}
