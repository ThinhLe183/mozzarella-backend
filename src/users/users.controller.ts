import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { AccessJwtAuthGuard } from 'src/auth/guards/access-jwt-auth.guard';
import { Request } from 'express';

//This route should be used by only admin
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AccessJwtAuthGuard)
  getMe(@Req() req: Request) {
    return req.user;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
}
