import { PartialType } from '@nestjs/swagger';
import { CreatePosicionDto } from './create-posicion.dto';

export class UpdatePosicionDto extends PartialType(CreatePosicionDto) {}
