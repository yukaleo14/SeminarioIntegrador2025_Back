import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePosicionDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  coordenadaX: number;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  coordenadaY: number;
}
