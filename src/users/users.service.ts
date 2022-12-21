import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

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
    return this.prismaService.user.findFirst({
      where: { username },
    });
  }
  async findById(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
      select: {
        username: true,
        createdAt: true,
        id: true,
        name: true,
        role: true,
        password: false,
      },
    });
    return user;
  }
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
}
