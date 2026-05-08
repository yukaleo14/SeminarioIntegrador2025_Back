import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SucursalModule } from './sucursal/sucursal.module';
import { HorarioModule } from './horario/horario.module';
import { PagoModule } from './pago/pago.module';
import { FormaPagoModule } from './forma-pago/forma-pago.module';
import { PedidoModule } from './pedido/pedido.module';
import { DetallePedidoModule } from './detalle-pedido/detalle-pedido.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ProductoModule } from './producto/producto.module';
import { CompradorModule } from './comprador/comprador.module';
import { EmpresaModule } from './empresa/empresa.module';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { PosicionModule } from './posicion/posicion.module';
import { RepartidorModule } from './repartidor/repartidor.module';
import { FileController } from './file/file.controller';
import { StrategyModule } from './strategy/strategy.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SucursalModule,
    HorarioModule,
    PagoModule,
    FormaPagoModule,
    PedidoModule,
    DetallePedidoModule,
    CategoriaModule,
    ProductoModule,
    CompradorModule,
    EmpresaModule,
    UbicacionModule,
    PosicionModule,
    RepartidorModule,
    StrategyModule,
    ChatModule,
  ],
  controllers: [FileController],
  providers: [],
})
export class AppModule {}
