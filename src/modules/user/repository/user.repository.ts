import { RepositoryAbstract } from 'src/cores/repository/repository.abstract';
import { User } from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class UserRepository extends RepositoryAbstract<User> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }
}
