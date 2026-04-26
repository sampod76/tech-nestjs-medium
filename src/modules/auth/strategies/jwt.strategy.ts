/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly UserService: UserService,
  ) {
    const envApp = configService.get('app', { infer: true });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envApp.jwt.access_secret,
    });
  }
  async validate(payload: any) {
    try {
      const user = await this.UserService.user(payload?.userId as string);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return {
        userId: user?._id ? user?._id.toString() : user?.id,
        role: user.roll,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
