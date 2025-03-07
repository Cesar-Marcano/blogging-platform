import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(6)
  @Transform(({ value }: { value: string }) => value?.trim())
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username should contain only letters, numbers, and underscores',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.trim())
  email: string;

  @IsString()
  @MinLength(6)
  @Transform(({ value }: { value: string }) => value?.trim())
  password: string;
}
