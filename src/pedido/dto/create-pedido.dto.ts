import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreatePedidoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  numero: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  fechaHoraPedido: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  horaLlegadaEstimada: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  montoTotal: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  tiempoPreparacionEstimado: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  tiempoRepartoEstimado: number;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  fechaHora: Date;

  @IsInt()
  @ApiProperty({ required: true })
  compradorId: number;

  @IsInt()
  @ApiProperty({ required: true })
  repartidorId: number;

  @IsInt()
  @ApiProperty({ required: true })
  empresaId: number;

  @IsInt()
  @ApiProperty({ required: true })
  rutaId: number;

  @IsInt()
  @ApiProperty({ required: true })
  pagoId: number;

  @IsNumber()
  @ApiProperty({ required: true })
  estadoId: number;

  @IsArray()
  @ApiProperty({ required: true, type: [Object] })
  detalle: any[];
}
