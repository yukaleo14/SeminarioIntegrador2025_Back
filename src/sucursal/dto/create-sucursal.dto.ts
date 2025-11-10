import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

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
  ubicacionId: number;

  @ApiProperty()
  @IsInt()
  empresaId: number;

  @IsString()
  @ApiProperty({ required: false, default: '' })
  altura?: string;
  @IsString()
  @ApiProperty({ required: false, default: '' })
  calle?: string;
  @IsString()
  @ApiProperty({ required: false, default: '' })
  nombreUbicacion?: string;

  @IsNumber()
  @ApiProperty({ required: false, default: 0 })
  coordenadaX?: number;
  @IsNumber()
  @ApiProperty({ required: false, default: 0 })
  coordenadaY?: number;
}
