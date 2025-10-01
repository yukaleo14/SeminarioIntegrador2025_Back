import { Module } from '@nestjs/common';
import { DetallePedidoService } from './detalle-pedido.service';
import { DetallePedidoController } from './detalle-pedido.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DetallePedidoController],
  providers: [DetallePedidoService, PrismaService],
})
export class DetallePedidoModule {}
