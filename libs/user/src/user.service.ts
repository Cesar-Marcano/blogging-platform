import { CreateUserDto } from '@app/common-dtos';
import { UpdateUserDto } from '@app/common-dtos/dto/update-user.dto';
import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: CreateUserDto) {
    return this.prismaService.user.create({
      data: user,
      select: {
        id: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserById(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserProfile(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
        email: true,
        id: true,
        name: true,
        comments: true,
        posts: true,
        ratifications: true,
        role: true,
      },
    });
  }

  async updateUserProfile(id: number, newUserInfo: UpdateUserDto) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: newUserInfo,
    });
  }

  async deleteUser(id: number) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
