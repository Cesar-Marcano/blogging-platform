import { PrismaService } from '@app/prisma';
import { ClientInfo } from '@app/token/interface/authToken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSession(
    userId: number,
    expiration: string,
    clientInfo: ClientInfo,
  ) {
    return this.prismaService.session.create({
      data: {
        ...clientInfo,
        expiration,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async closeSession(sessionUUID: string) {
    return this.prismaService.session.delete({
      where: {
        id: sessionUUID,
      },
    });
  }
}
