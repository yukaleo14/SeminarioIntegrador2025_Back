import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDetallePedidoDto {

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    cantidad: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    montoSubtotal: number;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    fechaHora: Date;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    pedidoId: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    productoId: number;
}
