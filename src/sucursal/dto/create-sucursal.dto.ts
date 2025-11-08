import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateSucursalDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsString()
  @ApiProperty({ required: false, default: '' })
  imagen: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ required: true })
  descripcion: string;

  @ApiProperty()
  @IsInt()
  estadoId: number;

  @ApiProperty()
  @IsInt()
  empresaId: number;

  @ApiProperty()
  @IsInt()
  ubicacionId: number;
}
