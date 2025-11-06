import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreatePedidoDto } from "src/pedido/dto/create-pedido.dto";

export class CreateCompradorDto {
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsString()
    nombre: string;
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsString()
    apellido: string;
    
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsNumber()
    cuilCuit: number;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsNumber()
    dni: number;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsString()
    telefono: number;
    
    @IsInt()
    @ApiProperty({ required: true })
    @IsNotEmpty()
    ubicacionId: number;
   
    @IsArray()
    @ApiProperty({ required: true, type: () => [CreatePedidoDto] })
    pedidos: CreatePedidoDto[];
    
    @IsInt()
    @ApiProperty({ required: true })
    @IsNotEmpty()
    usuarioId: number;
}
