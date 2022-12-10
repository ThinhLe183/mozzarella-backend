import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MessagesModule, PrismaModule, ConfigModule.forRoot()],
})
export class AppModule {}
