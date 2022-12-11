import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({ data: { ...createUserDto } });
  }

  findAll() {
    return `This action returns all users`;
  }

  findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: { username },
    });
  }
  findById(id: number) {
    return this.prismaService.user.findFirst({
      where: { id: id },
    });
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
