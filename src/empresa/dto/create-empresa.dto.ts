import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreatePedidoDto } from "src/pedido/dto/create-pedido.dto";

export class CreateEmpresaDto {

    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsNumber()
    cuitCuil: number;

    @IsArray()
    @ApiProperty({ required: true, type: () => [CreatePedidoDto] })
    pedidos: CreatePedidoDto[];

    @IsInt()
    @ApiProperty({ required: true })
    @IsNotEmpty()
    usuarioId: number;

    @IsInt()
    @ApiProperty({ required: true })
    @IsNotEmpty()
    sucursalId: number;
}
