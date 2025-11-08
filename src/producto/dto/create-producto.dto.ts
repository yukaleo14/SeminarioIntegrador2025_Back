import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  precio: number;

  @IsString()
  @ApiProperty({ required: false, default: '' })
  imagen: string;

  @IsString()
  @ApiProperty({ required: false, default: '' })
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  tiempoPreparacionEstimado: number;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  categoriaId: number;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  estadoId: number;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  sucursalId: number;
}
