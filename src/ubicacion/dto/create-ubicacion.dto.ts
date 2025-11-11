import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUbicacionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  altura: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  calle: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  posicionId: number;
}
