import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;
}
