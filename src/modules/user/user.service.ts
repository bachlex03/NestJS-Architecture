import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from 'src/config/config.service';
import { UserRepository } from './repository/user.repository';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';
import { FilterQuery } from 'mongoose';
import { SignUpDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // internal methods
  async create(dto: SignUpDto): Promise<User> {
    const result = await this.userRepository.create(dto);

    return plainToClass(User, result);
  }

  async findOneByEmail(email: string): Promise<User> {
    const result = await this.userRepository.findOneWithCondition({
      email,
    });

    return plainToClass(User, result);
  }
}
