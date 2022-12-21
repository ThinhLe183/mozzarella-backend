import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsString,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(8)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  role: any;
}
