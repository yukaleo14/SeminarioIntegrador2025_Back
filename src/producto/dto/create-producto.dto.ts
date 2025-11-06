import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateDetallePedidoDto } from 'src/detalle-pedido/dto/create-detalle-pedido.dto';
export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  tiempoPreparacionEstimado: number;

  /* @IsNotEmpty()
  @ApiProperty({ required: true })
  empresaId: number; */

  @IsNotEmpty()
  @ApiProperty({ required: true })
  categoriaId: number;


  @IsNotEmpty()
  @ApiProperty({ required: true })
  estadoId: number;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  sucursalId: number;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: () => [CreateDetallePedidoDto] })
  detalleDePedido: CreateDetallePedidoDto[];
  
}
