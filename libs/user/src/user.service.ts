import { CreateUserDto } from '@app/common-dtos';
import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: CreateUserDto): Promise<{ id: number }> {
    return this.prismaService.user.create({
      data: user,
      select: {
        id: true,
      },
    });
  }
}
