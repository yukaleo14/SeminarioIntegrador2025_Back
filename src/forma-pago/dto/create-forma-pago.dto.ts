import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePagoDto } from 'src/pago/dto/create-pago.dto';

export class CreateFormaPagoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsNotEmpty()
  @ApiProperty({ type: [CreatePagoDto] })
  pago: CreatePagoDto[];
}
