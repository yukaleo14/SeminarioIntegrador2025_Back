import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Rol } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ required: true })
  surname: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  dni: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ required: true })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  telephone: string;

  @ApiProperty({ required: false, default: Rol.CLIENTE })
  rol?: Rol = Rol.CLIENTE;
}
