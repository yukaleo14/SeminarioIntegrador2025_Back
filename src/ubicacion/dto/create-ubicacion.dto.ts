import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateCompradorDto } from "src/comprador/dto/create-comprador.dto";
import { CreateRutaDto } from "src/ruta/dto/create-ruta.dto";
import { CreateSucursalDto } from "src/sucursal/dto/create-sucursal.dto";

export class CreateUbicacionDto {
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    altura: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    calle: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    nombre: string;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsNumber()
    posicionId: number;

    @IsNotEmpty()
    @ApiProperty({ required: true })
    @IsDate()
    fechaHora: Date;

    @IsNotEmpty()
    @ApiProperty({ required: true, type: CreateSucursalDto })
    sucursal: CreateSucursalDto[];
    
    @IsNotEmpty()
    @ApiProperty({ required: true, type: CreateRutaDto })
    origen: CreateRutaDto[];
    
    @IsNotEmpty()
    @ApiProperty({ required: true, type: CreateRutaDto })
    destino: CreateRutaDto[];

    @IsNotEmpty()
    @ApiProperty({ required: true, type: CreateCompradorDto })
    comprador: CreateCompradorDto;

}
