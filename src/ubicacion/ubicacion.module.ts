import { Module } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { UbicacionController } from './ubicacion.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UbicacionController],
  providers: [UbicacionService, PrismaService],
})
export class UbicacionModule {}
