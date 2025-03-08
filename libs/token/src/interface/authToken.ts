import { Role } from '@prisma/client';

export enum TokenType {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
}

export interface TokenUser {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface ClientInfo {
  clientUUID: string;
  ipAddress: string;
  userAgent: string;
}

export interface AuthToken {
  uuid: string | null;
  type: TokenType;
  user: TokenUser;
  clientInfo: ClientInfo;
}
