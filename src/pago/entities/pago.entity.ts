import { ApiProperty } from '@nestjs/swagger';
import { FormaPago } from 'src/forma-pago/entities/forma-pago.entity';

export class Pago {
  @ApiProperty()
  id: number;
  @ApiProperty()
  numero: string;
  @ApiProperty()
  fechaHora: Date;
  @ApiProperty()
  monto: number;
  @ApiProperty()
  formaPago: FormaPago;
}
