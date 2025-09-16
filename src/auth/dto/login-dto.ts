import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  mail: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ required: true })
  contraseña: string;
}
