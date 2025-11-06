import { Module } from '@nestjs/common';
import { RutaService } from './ruta.service';
import { RutaController } from './ruta.controller';

@Module({
  controllers: [RutaController],
  providers: [RutaService],
})
export class RutaModule {}
