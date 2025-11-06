import { PartialType } from '@nestjs/swagger';
import { CreateRepartidorDto } from './create-repartidor.dto';

export class UpdateRepartidorDto extends PartialType(CreateRepartidorDto) {}
