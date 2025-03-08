import { IsInt, IsISO8601, IsNotEmpty } from 'class-validator';
import { ClientInfoDto } from './client-info.dto';

export class CreateSessionDto extends ClientInfoDto {
  @IsInt()
  userId: number;

  @IsISO8601()
  @IsNotEmpty()
  expiration: string;
}
