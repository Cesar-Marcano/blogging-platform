import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Session, User } from '@prisma/client';
import { AuthToken, ClientInfo, TokenType } from './interface/authToken';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateSessionDto } from 'apps/auth/src/session/dto/create-session.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async generateRefreshToken(user: User, clientInfo: ClientInfo) {
    const userPayload: AuthToken = {
      user,
      clientInfo,
      type: TokenType.REFRESH_TOKEN,
      uuid: null,
    };

    const sessionData: CreateSessionDto = {
      clientUUID: clientInfo.clientUUID,
      expiration: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXP',
        '60d',
      ),
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      userId: user.id,
    };

    const session: Session = await lastValueFrom(
      this.authClient.emit('session.create', sessionData),
    );

    userPayload.uuid = session.clientUUID;

    const refreshToken = this.jwtService.sign(userPayload);

    return refreshToken;
  }

  generateAccessToken(user: User, sessionUUID: string, clientInfo: ClientInfo) {
    const userPayload: AuthToken = {
      user,
      clientInfo,
      type: TokenType.ACCESS_TOKEN,
      uuid: sessionUUID,
    };

    const accessToken = this.jwtService.sign(userPayload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXP', '15m'),
    });

    return accessToken;
  }
}
