import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRepartidorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  apellido: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  cuitCuil: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  dni: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  telefono: string;

  @IsString()
  @ApiProperty()
  imagenPerfil: string;

  @ApiProperty({ required: true })
  usuarioId: number;
}
