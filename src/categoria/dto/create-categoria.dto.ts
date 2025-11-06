import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  fechaHora: Date;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: () => [] })
  productoIds: number[];
}
