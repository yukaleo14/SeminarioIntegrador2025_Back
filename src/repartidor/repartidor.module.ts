import { Module } from '@nestjs/common';
import { RepartidorService } from './repartidor.service';
import { RepartidorController } from './repartidor.controller';

@Module({
  controllers: [RepartidorController],
  providers: [RepartidorService],
})
export class RepartidorModule {}
