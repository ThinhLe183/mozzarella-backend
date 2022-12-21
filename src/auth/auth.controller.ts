import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Get,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async logIn(@Req() req: Request) {
    return this.authService.logIn(req.user);
  }

  @Post('refreshToken')
  @HttpCode(200)
  async refreshTokens(@Body() body) {
    return await this.authService.refreshToken(body.refresh_token);
  }
}
