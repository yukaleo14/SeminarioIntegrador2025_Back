import { Module } from '@nestjs/common';
import { PosicionService } from './posicion.service';
import { PosicionController } from './posicion.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PosicionController],
  providers: [PosicionService, PrismaService],
})
export class PosicionModule {}
