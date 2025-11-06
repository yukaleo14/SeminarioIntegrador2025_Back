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

    @IsNotEmpty()
    @ApiProperty({ required: true })
    compradorId: number;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    empresaId: number;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    repartidorId: number;

    @IsInt()
    @ApiProperty({ required: true })
    rutaId: number;

    @IsInt()
    @ApiProperty({ required: true })
    pagoId: number;

    @IsInt()
    @ApiProperty({ required: true })
    estadoId: number;

    @IsArray()
    @ApiProperty({ required: true, type: [Object] })
    detalle: any[];
}
