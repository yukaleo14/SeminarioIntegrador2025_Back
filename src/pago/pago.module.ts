import { Module } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PagoController],
  providers: [PagoService, PrismaService],
})
export class PagoModule {}
