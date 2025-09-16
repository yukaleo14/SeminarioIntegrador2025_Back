import { ApiProperty } from '@nestjs/swagger';

export class FormaPago {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nombre: string;
}
