import { IsNotEmpty } from "class-validator";
import { CreatePedidoDto } from "./../../pedido/dto/create-pedido.dto";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRutaDto {
    
    tarifaDistancia: number;

    @IsNotEmpty()
    @ApiProperty({ required: true, type: CreatePedidoDto })
    pedido: CreatePedidoDto;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    origenId: number;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    destinoId: number;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    ubicacionId: number;

}
