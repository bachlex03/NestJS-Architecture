import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as Jwt } from 'passport-jwt';
import { ConfigService } from 'src/config/config.service';
import { JwtPayload } from './jwt-payload';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Jwt) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    let user = (await this.cacheService.get(payload.email)) as User;

    if (!user) {
      user = await this.userService.originalFindOne({ email: payload.email });
      await this.cacheService.set(
        payload.email,
        user,
        this.configService.get('REDIS_EMAIL_TTL') as number,
      );
    }

    return user;
  }
}
