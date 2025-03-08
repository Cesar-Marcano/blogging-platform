import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ClientInfoDto {
  @IsString()
  @IsNotEmpty()
  device: string;

  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  clientUUID: string;
}
