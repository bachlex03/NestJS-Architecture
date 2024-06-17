import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from 'src/config/config.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  saltOrRounds: any = this.configService.get('SALT_OR_ROUNDS') ?? 10;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(dto: SignUpDto) {
    const userExist = await this.userService.findOneByEmail(dto.email);

    if (userExist) {
      return null;
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.saltOrRounds);

    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    return user;
  }

  async signIn(dto: SignInDto) {}

  async signOut() {}

  async forgotPassword() {}

  async resetPassword() {}

  async changePassword() {}

  // internal methods
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordMatch = await bcrypt.compare(password, user?.password);

    if (!isPasswordMatch) {
      return null;
    }

    return user;
  }
}
