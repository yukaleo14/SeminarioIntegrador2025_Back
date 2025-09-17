import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSucursalDto {
    
    @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ required: true })
  direccion: string;

  @ApiProperty()
  @IsInt()
  estadoId: number;

  @ApiProperty()
  @IsInt()
  usuarioId: number;

}

