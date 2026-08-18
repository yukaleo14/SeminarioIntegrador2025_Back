import { PartialType } from '@nestjs/swagger';
import { CreateFormaPagoDto } from './create-forma-pago.dto';

export class UpdateFormaPagoDto extends PartialType(CreateFormaPagoDto) {}
