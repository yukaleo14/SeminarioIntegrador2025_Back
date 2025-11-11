import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PosicionService } from 'src/posicion/posicion.service';
import { UbicacionService } from 'src/ubicacion/ubicacion.service';

@Module({
  controllers: [SucursalController],
  providers: [SucursalService, PosicionService, UbicacionService],
  imports: [PrismaModule],
})
export class SucursalModule {}
