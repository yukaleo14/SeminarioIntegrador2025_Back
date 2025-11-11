import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PosicionService } from 'src/posicion/posicion.service';
import { UbicacionService } from 'src/ubicacion/ubicacion.service';
import { ProductoService } from 'src/producto/producto.service';

@Module({
  controllers: [SucursalController],
  providers: [
    SucursalService,
    PosicionService,
    UbicacionService,
    ProductoService,
  ],
  imports: [PrismaModule],
})
export class SucursalModule {}
