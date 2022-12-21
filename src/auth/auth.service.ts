import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from 'src/configs/jwtConfig.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private jwtConfigService: JwtConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.findByUsername(createUserDto.username);
    if (user) {
      throw new Error('User already existed');
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createUserDto.password, salt);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashPassword,
    });

    return await this.sendBackTokens(newUser);
  }

  async logIn(user) {
    return await this.sendBackTokens(user);
  }

  async refreshToken(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findById(payload.sub);
    const accessToken = await this.generateNewAccessToken(user);
    return {
      access_token: accessToken,
      expires_in: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      expiration_time: this.jwtConfigService.accessTokenExpirationTime,
      user_id: user.id,
      token_type: 'Bearer',
    };
  }
  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByUsername(loginUserDto.username);
    if (!user) {
      throw new NotFoundException(`The username you entered isn't existed`);
    }
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (isMatch) {
      return user;
    } else {
      throw new UnauthorizedException({ message: 'Incorrect password' });
    }
  }

  private async generateNewAccessToken(user) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.jwtConfigService.accesssTokenExpiresIn,
    });
    return accessToken;
  }
  private async generateNewRefreshToken(user) {
    const payload = { username: user.username, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.jwtConfigService.refreshTokenExpirationTime,
    });
    return refreshToken;
  }

  private async sendBackTokens(user) {
    const accessToken = await this.generateNewAccessToken(user);
    const refreshToken = await this.generateNewRefreshToken(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      expiration_time: this.jwtConfigService.accessTokenExpirationTime,
      user_id: user.id,
      token_type: 'Bearer',
    };
  }

  verifyAccessToken(accessToken: string) {
    const token = accessToken.split(' ')[1];
    return this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      const token = refreshToken.split(' ')[1];
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Token expired or invalid');
    }
  }
}
