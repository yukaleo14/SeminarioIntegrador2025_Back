import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePedidoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  numero: string;

  @IsDate()
  @Type(() => Date)
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
  @Type(() => Date)
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

  @IsNumber() origenLat: number;   // lat de la sucursal
  @IsNumber() origenLng: number;   // lng de la sucursal
  @IsNumber() destinoLat: number;  // lat del comprador
  @IsNumber() destinoLng: number;  // lng del comprador

  @IsOptional() @IsString() nombreSucursal?: string;
  @IsOptional() @IsString() calleComprador?: string;
  @IsOptional() @IsString() alturaComprador?: string;
}
