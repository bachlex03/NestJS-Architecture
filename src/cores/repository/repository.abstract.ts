import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import mongoose, {
  FilterQuery,
  Model,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { EntityBase } from 'src/cores/repository/entity.base';
import { RepositoryInterface } from 'src/cores/repository/repository.interface';
import { User } from 'src/modules/user/entities/user.entity';
import { BadRequestException } from '../exceptions/bad-request.exception';
import * as dayjs from 'dayjs';

export abstract class RepositoryAbstract<T extends EntityBase>
  implements RepositoryInterface
{
  constructor(private model: Model<T>) {}

  /*
   * methods for data not deleted yet
   * @condition deleted_at: null
   * @returns Document where deleted_at is null
   */
  async findOneById(id: string): Promise<T> {
    const result = (await this.model.findById(id).lean().exec()) as T;

    return result.deleted_at ? null : result;
  }

  async findMany(filter: FilterQuery<T>): Promise<T[]> {
    const results = (await this.model
      .find({ ...filter, deleted_at: null })
      .lean()
      .exec()) as T[];

    return results;
  }

  async findOneWithCondition(filter: FilterQuery<T> = {}): Promise<T> {
    const result = (await this.model.findOne(filter).lean().exec()) as T;

    return result?.deleted_at ? null : result;
  }

  async create(data: object): Promise<T> {
    let result = await this.model.create({
      ...(data as T),
    });

    return result.toObject();
  }

  async updateOneById(
    id: string,
    updates: UpdateQuery<T>,
    opts: QueryOptions<T>,
  ): Promise<T> {
    const result = (await this.model
      .findByIdAndUpdate(id, updates, opts)
      .lean()
      .exec()) as T;

    return result?.deleted_at ? null : result;
  }

  /*
   * methods for data was deleted
   * @condition deleted_at: { $ne: null}
   * @returns Document where deleted_at is not null
   */
  async findOneDeleted(filter: FilterQuery<T>): Promise<T> {
    const result = (await this.model
      .findOne({
        ...filter,
        deleted_at: {
          $ne: null,
        },
      })
      .lean()
      .exec()) as T;

    return result;
  }

  async softDelete(id: string): Promise<boolean> {
    const objectId = new mongoose.Types.ObjectId(id);

    const result = await this.model
      .updateOne({ _id: objectId, deleted_at: null }, { deleted_at: dayjs() })
      .lean()
      .exec();

    return result.modifiedCount > 0;
  }

  async restore(id: string): Promise<boolean> {
    const objectId = new mongoose.Types.ObjectId(id);

    const result = await this.model
      .findOneAndUpdate(
        { _id: objectId, deleted_at: { $ne: null } },
        { deleted_at: null },
        { new: true },
      )
      .lean();

    return result.deleted_at === null;
  }

  async hardDelete(id: string): Promise<boolean> {
    const objectId = new mongoose.Types.ObjectId(id);

    const result = await this.model
      .findOneAndDelete({ _id: objectId, deleted_at: { $ne: null } })
      .lean();

    return !!result;
  }

  // internal methods
  async findOne(filter: FilterQuery<T>): Promise<T> {
    const result = (await this.model.findOne(filter).lean().exec()) as T;

    return result;
  }
}
