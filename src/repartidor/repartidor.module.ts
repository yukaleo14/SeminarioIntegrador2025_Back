import { Module } from '@nestjs/common';
import { RepartidorService } from './repartidor.service';
import { RepartidorController } from './repartidor.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RepartidorController],
  providers: [RepartidorService],
  exports: [RepartidorService],
})
export class RepartidorModule {}
