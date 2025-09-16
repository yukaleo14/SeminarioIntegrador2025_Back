import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePagoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  numero: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  monto: number;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  fechaHora: Date;

  @ApiProperty()
  @IsInt()
  formaPagoId: number;

  @ApiProperty()
  @IsInt()
  estadoId: number;
}
