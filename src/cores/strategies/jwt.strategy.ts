import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as Jwt } from 'passport-jwt';
import { ConfigService } from 'src/config/config.service';
import { JwtPayload } from './jwt-payload';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Jwt) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayload) {
    console.log('payload: ', payload);
    return { test: 'test' };
  }
}
