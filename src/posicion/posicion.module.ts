import { Module } from '@nestjs/common';
import { PosicionService } from './posicion.service';
import { PosicionController } from './posicion.controller';

@Module({
  controllers: [PosicionController],
  providers: [PosicionService],
})
export class PosicionModule {}
