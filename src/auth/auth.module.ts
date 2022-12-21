import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AcJwtStrategy } from './strategies/ac-jwt.strategy';
import { JwtConfigService } from 'src/configs/jwtConfig.service';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    ConfigService,
    AcJwtStrategy,
    JwtConfigService,
  ],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN,
      signOptions: { expiresIn: process.env.JWT_ACCESS_SECRET_EXPIRE },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
