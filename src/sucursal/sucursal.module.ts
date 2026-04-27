import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductoModule } from '../producto/producto.module';
import { UbicacionModule } from '../ubicacion/ubicacion.module';
import { PosicionModule } from '../posicion/posicion.module';

@Module({
  controllers: [SucursalController],
  providers: [SucursalService],
  imports: [PrismaModule, ProductoModule, UbicacionModule, PosicionModule],
})
export class SucursalModule {}
