import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
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
  @ApiProperty({ required: false })
  apellido: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  mail: string;

  @IsString()
  @ApiProperty({ required: false })
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
  cuitCuil: string;

  @ApiProperty({ required: false, default: Rol.COMPRADOR })
  rol?: Rol = Rol.COMPRADOR;

  @ApiProperty({ required: false })
  imagenPerfil?: string;

  @IsString()
  @ApiProperty({ required: false })
  altura: string;
  @IsString()
  @ApiProperty({ required: false })
  calle: string;
  @IsString()
  @ApiProperty({ required: false })
  nombreUbicacion: string;

  @IsNumber()
  @ApiProperty({ required: false })
  coordenadaX: number;
  @IsNumber()
  @ApiProperty({ required: false })
  coordenadaY: number;
}
