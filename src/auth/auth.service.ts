import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async test(user) {
    console.log(this.configService.get('JWT_REFRESH_EXPIRE'));
    return 'oke';
  }

  async register(createUserDto: CreateUserDto, res: Response) {
    const user = await this.usersService.findByUsername(createUserDto.username);
    if (user) {
      throw new Error('User already existed');
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createUserDto.password, salt);
    const newUser = this.usersService.create({
      ...createUserDto,
      password: hashPassword,
    });
    const accessToken = this.sendBackTokens(newUser, res);
    return accessToken;
  }

  async logIn(user: any, res: Response) {
    const accessToken = this.sendBackTokens(user, res);
    return accessToken;
  }

  async refreshToken(user: any) {
    const newAccessToken = await this.generateNewAccessToken(user);
    return newAccessToken;
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByUsername(loginUserDto.username);
    if (!user) {
      throw new NotFoundException(`There is no user under this username`);
    }
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (isMatch) return user;
    throw new UnauthorizedException({ message: 'Incorrect password' });
  }

  private async generateNewAccessToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
    });
    return accessToken;
  }
  private async generateNewRefreshToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
    });
    return refreshToken;
  }

  private async sendBackTokens(user: any, res: Response) {
    const accessToken = await this.generateNewAccessToken(user);
    const refreshToken = await this.generateNewRefreshToken(user);
    res.cookie('refresh-token', refreshToken, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return accessToken;
  }
}
