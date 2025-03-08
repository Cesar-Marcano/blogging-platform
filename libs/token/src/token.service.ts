import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Session, User } from '@prisma/client';
import { AuthToken, ClientInfo, TokenType } from './interface/authToken';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateSessionDto } from 'apps/auth/src/session/dto/create-session.dto';
import { ConfigService } from '@nestjs/config';
import { InvalidTokenException } from '@app/errors/invalidToken.error';
import * as dayjs from 'dayjs';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  private validateToken(token: string, tokenType: TokenType): AuthToken {
    try {
      const payload: AuthToken = this.jwtService.verify<AuthToken>(token, {
        secret: this.configService.get<string>(
          `JWT_${TokenType[tokenType]}_TOKEN_SECRET`,
        ),
      });

      if (payload.type !== tokenType) {
        throw new InvalidTokenException(
          `Invalid ${TokenType[tokenType]} token type`,
        );
      }

      return payload;
    } catch {
      throw new InvalidTokenException(`Invalid ${TokenType[tokenType]} token`);
    }
  }

  private generateToken(
    user: User,
    clientInfo: ClientInfo,
    tokenType: TokenType,
    sessionUUID: string | null = null,
  ) {
    const userPayload: AuthToken = {
      user,
      clientInfo,
      type: tokenType,
      uuid: sessionUUID,
    };

    return this.jwtService.sign(userPayload, {
      expiresIn: this.configService.get<string>(
        tokenType === TokenType.REFRESH_TOKEN
          ? 'JWT_REFRESH_TOKEN_EXP'
          : 'JWT_ACCESS_TOKEN_EXP',
        tokenType === TokenType.REFRESH_TOKEN ? '60d' : '15m',
      ),
    });
  }

  async generateRefreshToken(user: User, clientInfo: ClientInfo) {
    const tokenDuration = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_EXP',
      '60d',
    );

    const sessionData: CreateSessionDto = {
      clientUUID: clientInfo.clientUUID,
      expiration: dayjs().add(parseInt(tokenDuration), 'day').toISOString(),
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
      userId: user.id,
    };

    const session: Session = await lastValueFrom(
      this.authClient.emit('session.create', sessionData),
    );

    if (!session || !session.clientUUID) {
      throw new Error('Failed to create session or retrieve clientUUID');
    }

    return this.generateToken(
      user,
      clientInfo,
      TokenType.REFRESH_TOKEN,
      session.clientUUID,
    );
  }

  generateAccessToken(user: User, sessionUUID: string, clientInfo: ClientInfo) {
    return this.generateToken(
      user,
      clientInfo,
      TokenType.ACCESS_TOKEN,
      sessionUUID,
    );
  }

  validateRefreshToken(token: string): AuthToken {
    return this.validateToken(token, TokenType.REFRESH_TOKEN);
  }

  validateAccessToken(token: string): AuthToken {
    return this.validateToken(token, TokenType.ACCESS_TOKEN);
  }
}
