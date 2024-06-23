import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as Local } from 'passport-local';
import { AuthService } from 'src/modules/auth/auth.service';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Local) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user: User | null = await this.authService.validateUser(
      email,
      password,
    );

    return user;
  }
}
