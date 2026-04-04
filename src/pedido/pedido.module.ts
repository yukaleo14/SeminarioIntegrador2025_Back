import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PedidoGateway } from './pedido.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [PedidoController],
  providers: [
    PedidoService,
    PedidoGateway,
  ],
})
export class PedidoModule {}
