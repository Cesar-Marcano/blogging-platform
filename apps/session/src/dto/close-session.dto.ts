import { IsNotEmpty, IsUUID } from 'class-validator';

export class CloseSessionDto {
  @IsUUID()
  @IsNotEmpty()
  sessionUUID: string;
}
