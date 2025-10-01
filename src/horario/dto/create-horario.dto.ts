import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Dia } from '@prisma/client';

export class CreateHorarioDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  dia: Dia;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  desde: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  hasta: string;

  @ApiProperty()
  @IsInt()
  sucursalId: number;
}
