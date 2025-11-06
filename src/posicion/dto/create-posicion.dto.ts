import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateUbicacionDto } from "src/ubicacion/dto/create-ubicacion.dto";

export class CreatePosicionDto {

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ required: true })
    coordenadaX: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ required: true })
    coordenadaY: number;

    @IsNotEmpty()
    @ApiProperty({ required: true, type: CreateUbicacionDto })
    ubicacion: CreateUbicacionDto;


}
