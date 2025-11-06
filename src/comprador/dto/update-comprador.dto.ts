import { PartialType } from '@nestjs/swagger';
import { CreateCompradorDto } from './create-comprador.dto';

export class UpdateCompradorDto extends PartialType(CreateCompradorDto) {}
