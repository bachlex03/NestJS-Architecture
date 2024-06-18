import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from 'src/config/config.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from 'src/cores/strategies/jwt-payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  saltOrRounds: any = this.configService.get('SALT_OR_ROUNDS') ?? 10;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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

  async signIn(user: User) {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = this.generateTokenPair(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signOut() {}

  async forgotPassword() {}

  async resetPassword() {}

  async changePassword() {}

  // internal methods
  async validateUser(email: string, password: string): Promise<User | null> {
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
