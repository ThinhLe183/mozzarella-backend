import { IsNotEmpty, MaxLength, MinLength, IsString } from 'class-validator';

export class LoginUserDto {
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
}
