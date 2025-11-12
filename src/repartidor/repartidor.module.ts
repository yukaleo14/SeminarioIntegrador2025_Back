import { Module } from '@nestjs/common';
import { RepartidorService } from './repartidor.service';
import { RepartidorController } from './repartidor.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RepartidorController],
  providers: [RepartidorService, PrismaService],
})
export class RepartidorModule {}
