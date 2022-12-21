import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get accesssTokenExpiresIn(): string {
    return this.configService.get('JWT_ACCESS_EXPIRES_IN');
  }
  get accessTokenExpirationTime(): number {
    return (
      Date.now() + parseInt(this.configService.get('JWT_ACCESS_EXPIRES_IN'))
    );
  }
  get refreshTokenExpirationTime(): number {
    return (
      Date.now() + parseInt(this.configService.get('JWT_REFRESH_EXPIRES_IN'))
    );
  }
}
