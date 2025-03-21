import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '@app/prisma';

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [PrismaService],
})
export class UserModule {}
