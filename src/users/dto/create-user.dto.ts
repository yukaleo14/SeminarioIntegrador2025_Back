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
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ required: true })
  apellido: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  mail: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  dni: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ required: true })
  contraseña: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  telefono: string;

  @IsString()
  @ApiProperty({ default: '', required: false })
  cuit?: string;

  @ApiProperty({ required: false, default: Rol.CLIENTE })
  rol?: Rol = Rol.CLIENTE;
}
