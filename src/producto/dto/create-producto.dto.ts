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
  precioUnidad: number;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  categoriaId: number;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  estadoId: number;
}
