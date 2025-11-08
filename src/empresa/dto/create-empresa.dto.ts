import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  cuitCuil: string;

  @IsString()
  @ApiProperty({ default: '' })
  imagenPerfil: string;

  @ApiProperty({ required: true })
  usuarioId: number;
}
