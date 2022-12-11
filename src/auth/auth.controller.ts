import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AccessJwtAuthGuard } from './guards/access-jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(createUserDto, res);
  }

  @Post('logIn')
  @UseGuards(LocalAuthGuard)
  async logIn(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logIn(req.user, res);
  }

  @Post('refreshToken')
  @UseGuards(RefreshJwtAuthGuard)
  async refreshTokens(@Req() req: Request) {
    return await this.authService.refreshToken(req.user);
  }
  @Get('test')
  @UseGuards(AccessJwtAuthGuard)
  async test(@Req() req: Request) {
    return await this.authService.test(req.user);
  }
}
