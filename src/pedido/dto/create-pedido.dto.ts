import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { CreateRutaDto } from '../../ruta/dto/create-ruta.dto';

export class CreatePedidoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  numero: string;

  @IsString()
  @IsNotEmpty()
  horaLlegadaEstimada: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  montoTotal: number;

  @IsNumber()
  @IsNotEmpty()
  tiempoPreparacionEstimado: number;

  @IsNumber()
  @IsNotEmpty()
  tiempoRepartoEstimado: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  fechaHora: string;

  @IsInt()
  @ApiProperty({ required: true })
  compradorId: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  repartidorId?: number;

  @IsInt()
  @ApiProperty({ required: true })
  empresaId: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  rutaId?: number;

  @IsNotEmpty()
  @ValidateNested()
  infoRuta: {
    origen: { coordenadas: { lat: number; lng: number }; calle: string };
    destino: { coordenadas: { lat: number; lng: number }; calle: string };
  };

  @IsInt()
  @ApiProperty({ required: true })
  pagoId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  estadoId?: number;

  @IsArray()
  @ApiProperty({ type: [Object] })
  detalle: {
    productoId: number;
    cantidad: number;
    montoSubtotal: number;
  }[];
}
