import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PedidoGateway } from '../websocket/pedido.gateway';
import { RutaModule } from '../ruta/ruta.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, RutaModule, AuthModule],
  controllers: [PedidoController],
  providers: [PedidoService, PedidoGateway],
  exports: [PedidoService],
})
export class PedidoModule {}
