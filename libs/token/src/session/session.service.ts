import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateSessionDto } from 'apps/auth/src/session/dto/create-session.dto';
import { Session, User } from '@prisma/client';
import * as dayjs from 'dayjs';
import { ClientInfo } from '../interface/authToken';
import { InvalidSessionException } from '@app/errors/invalidSession.error';

@Injectable()
export class SessionService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  /**
   * Creates a new session for the given user and client information.
   *
   * @param clientInfo - The information about the client initiating the session.
   * @param user - The user for whom the session is being created.
   * @returns A promise that resolves to the created session.
   * @throws InvalidSessionException - If the session creation fails or the clientUUID is not retrieved.
   */
  async createSession(clientInfo: ClientInfo, user: User): Promise<Session> {
    const sessionData: CreateSessionDto = {
      clientUUID: clientInfo.clientUUID,
      expiration: dayjs().add(60, 'day').toISOString(),
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      userId: user.id,
    };

    const session: Session = await lastValueFrom(
      this.authClient.emit('session.create', sessionData),
    );

    if (!session || !session.clientUUID) {
      throw new InvalidSessionException(
        'Failed to create session or retrieve clientUUID',
      );
    }

    return session;
  }
}
