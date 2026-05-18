import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  formaPagoId?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  estadoId?: number;
}
