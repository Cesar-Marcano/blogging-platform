import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { ClientInfo, AuthToken, TokenType } from './interface/authToken';
import { InvalidTokenException } from '@app/errors/invalidToken.error';
import { SessionService } from './session/session.service';

@Injectable()
export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    const accessTokenSecret = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_SECRET',
    );
    const refreshTokenSecret = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_SECRET',
    );

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error('JWT secrets are not defined in the environment');
    }

    this.accessTokenSecret = accessTokenSecret;
    this.refreshTokenSecret = refreshTokenSecret;
  }

  /**
   * Validates a given token based on its type.
   *
   * @param token - The token string to be validated.
   * @param tokenType - The type of the token (ACCESS_TOKEN or REFRESH_TOKEN).
   * @returns The payload of the authenticated token.
   * @throws {InvalidTokenException} If the token is invalid or the token type does not match.
   */
  private validateToken(token: string, tokenType: TokenType): AuthToken {
    try {
      const payload: AuthToken = this.jwtService.verify<AuthToken>(token, {
        secret:
          tokenType === TokenType.ACCESS_TOKEN
            ? this.accessTokenSecret
            : this.refreshTokenSecret,
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

  /**
   * Generates a JWT token based on the provided user information, client information, token type, and session UUID.
   *
   * @param user - The user for whom the token is being generated.
   * @param clientInfo - Information about the client requesting the token.
   * @param tokenType - The type of token to generate (e.g., access token or refresh token).
   * @param sessionUUID - An optional session UUID. Defaults to null if not provided.
   * @returns The generated JWT token as a string.
   */
  private generateToken(
    user: User,
    clientInfo: ClientInfo,
    tokenType: TokenType,
    sessionUUID: string | null = null,
  ): string {
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

  /**
   * Generates a refresh token for the given user and client information.
   *
   * @param user - The user for whom the refresh token is being generated.
   * @param clientInfo - The client information associated with the request.
   * @returns A promise that resolves to the generated refresh token string.
   */
  async generateRefreshToken(
    user: User,
    clientInfo: ClientInfo,
  ): Promise<string> {
    const session = await this.sessionService.createSession(clientInfo, user);

    return this.generateToken(
      user,
      clientInfo,
      TokenType.REFRESH_TOKEN,
      session.clientUUID,
    );
  }

  /**
   * Generates an access token for the specified user.
   *
   * @param user - The user for whom the access token is being generated.
   * @param sessionUUID - The unique identifier for the user's session.
   * @param clientInfo - Information about the client making the request.
   * @returns The generated access token as a string.
   */
  generateAccessToken(
    user: User,
    sessionUUID: string,
    clientInfo: ClientInfo,
  ): string {
    return this.generateToken(
      user,
      clientInfo,
      TokenType.ACCESS_TOKEN,
      sessionUUID,
    );
  }

  /**
   * Validates a given refresh token.
   *
   * @param token - The refresh token to be validated.
   * @returns The validated authentication token.
   */
  validateRefreshToken(token: string): AuthToken {
    return this.validateToken(token, TokenType.REFRESH_TOKEN);
  }

  /**
   * Validates the provided access token.
   *
   * @param token - The access token to be validated.
   * @returns The validated access token as an AuthToken object.
   */
  validateAccessToken(token: string): AuthToken {
    return this.validateToken(token, TokenType.ACCESS_TOKEN);
  }
}
