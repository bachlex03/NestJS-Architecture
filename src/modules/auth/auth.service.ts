import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { ConfigService } from 'src/config/config.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from 'src/modules/auth/strategies/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { UserNotFoundException } from 'src/cores/exceptions/not-found.exception';
import {
  UserDeletedException,
  userExistException,
} from 'src/cores/exceptions/bad-request.exception';
import { ResponseInterface } from './auth.interface';

@Injectable()
export class AuthService {
  saltOrRounds: any = this.configService.get('SALT_OR_ROUNDS') ?? 10;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<ResponseInterface> {
    const userExist = await this.userService.originalFindOne({
      email: dto.email,
    });

    // check if user exist
    if (userExist) {
      throw new userExistException('Email already exist');
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.saltOrRounds);

    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    });

    const payload: JwtPayload = {
      user_id: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = this.generateTokenPair(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(user: User): Promise<ResponseInterface> {
    const payload: JwtPayload = {
      user_id: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = this.generateTokenPair(payload);

    let deleted_at = user?.deleted_at
      ? dayjs(user.deleted_at).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      : null;

    let removed_at = user?.deleted_at
      ? dayjs(user.deleted_at)
          .add(this.configService.get('ACCOUNT_REMOVE_IN') as number, 'ms')
          .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      : null;

    return {
      accessToken,
      refreshToken,
      deleted_at,
      removed_at,
    };
  }

  async signOut() {}

  async forgotPassword() {}

  async resetPassword() {}

  async changePassword() {}

  async refreshToken() {}

  async softDeleteUser(user: User) {}

  async restoreUser() {}

  async forceDeleteUser() {}

  // internal methods
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.originalFindOne({
      email,
    });

    if (!user) {
      return null;
    }

    const isPasswordMatch = await bcrypt.compare(password, user?.password);

    if (!isPasswordMatch) {
      return null;
    }

    return user;
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get('JWT_SECRET')}`,
      expiresIn: `${this.configService.get('JWT_AT_EXPIRES_IN')}`,
    });
  }

  generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get('JWT_SECRET')}`,
      expiresIn: `${this.configService.get('JWT_RT_EXPIRES_IN')}`,
    });
  }

  generateTokenPair(payload: JwtPayload): [string, string] {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return [accessToken, refreshToken];
  }
}
