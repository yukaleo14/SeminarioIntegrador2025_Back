import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Dia } from '@prisma/client';

export class CreateHorarioDto {
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  dia: Dia;
}
