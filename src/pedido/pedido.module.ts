import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PedidoGateway } from './pedido.gateway';
import { RutaModule } from '../ruta/ruta.module';

@Module({
  imports: [PrismaModule, RutaModule], // Importamos RutaModule para usar RutaService
  controllers: [PedidoController],
  providers: [
    PedidoService,
    PedidoGateway,
  ],
})
export class PedidoModule {}
