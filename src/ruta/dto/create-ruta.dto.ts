import { IsNotEmpty } from 'class-validator';
import { CreatePedidoDto } from './../../pedido/dto/create-pedido.dto';
import { ApiProperty } from '@nestjs/swagger';

export interface Coordenadas {
  lat: number;
  lng: number;
}

export class CreateRutaDto {
  tarifaDistancia: number;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: CreatePedidoDto })
  pedido: CreatePedidoDto;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  origen: {
    coordenadas: Coordenadas; // [lat, lng]
    nombre: string;
    calle: string;
    altura: string;
  };

  @IsNotEmpty()
  @ApiProperty({ required: true })
  destino: {
    coordenadas: Coordenadas; // [lat, lng]
    nombre: string;
    calle: string;
    altura: string;
  };

  @IsNotEmpty()
  @ApiProperty({ required: true })
  ubicacionId: number;
}
