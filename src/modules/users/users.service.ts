import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class UsersService {
  constructor(private readonly ConfigService: ConfigService) {}
}
