import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as Jwt } from 'passport-jwt';
import { ConfigService } from 'src/config/config.service';
import { JwtPayload } from './jwt-payload';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Jwt) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayload) {
    const user = this.userService.originalFindOne({ email: payload.email });

    return user;
  }
}
