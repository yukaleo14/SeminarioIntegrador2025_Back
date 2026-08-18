import { Module } from '@nestjs/common';
import { RutaService } from './ruta.service';
import { RutaController } from './ruta.controller';
import { HttpModule } from '@nestjs/axios';
import { Prisma } from '@prisma/client';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [RutaController],
  providers: [RutaService],
  exports: [RutaService], // Exportamos el servicio para usarlo en PedidoService
})
export class RutaModule {}
