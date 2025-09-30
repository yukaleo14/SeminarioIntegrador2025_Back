import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreatePedidoDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    numero : string;

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
    usuarioId: string;

    @IsInt()
    @ApiProperty({ required: true })
    deliveryId: string;

    @IsInt()
    @ApiProperty({ required: true })
    companyId: string;

    @IsInt()
    @ApiProperty({ required: true })
    rutaId: string;

    @IsInt()
    @ApiProperty({ required: true })
    pagoId: string;

    @IsString()
    @ApiProperty({ required: true })
    estadoId: string;

    @IsArray()
    @ApiProperty({ required: true, type: [Object] })
    detallePedidos: any[];
}
