import { Module } from '@nestjs/common';
import compradorStrategy from './implementations/comprador.strategy';
import EmpresaStrategy from './implementations/empresa.strategy';
import RepartidorStrategy from './implementations/repartidor.strategy';
import { StrategyFactory } from './strategy.factory';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PosicionModule } from '../posicion/posicion.module';
import { UbicacionModule } from '../ubicacion/ubicacion.module';
import { CompradorModule } from '../comprador/comprador.module';
import { EmpresaModule } from '../empresa/empresa.module';
import { RepartidorModule } from '../repartidor/repartidor.module';

@Module({
  providers: [
    compradorStrategy,
    EmpresaStrategy,
    RepartidorStrategy,
    StrategyFactory,
  ],
  exports: [StrategyFactory],
  imports: [
    PrismaModule,
    UsersModule,
    PosicionModule,
    UbicacionModule,
    CompradorModule,
    EmpresaModule,
    RepartidorModule,
  ],
})
export class StrategyModule {}
