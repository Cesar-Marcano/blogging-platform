import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  Matches,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  @Transform(({ value }: { value: string }) => value?.trim())
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username should contain only letters, numbers, and underscores',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.trim())
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @Transform(({ value }: { value: string }) => value?.trim())
  password?: string;
}
