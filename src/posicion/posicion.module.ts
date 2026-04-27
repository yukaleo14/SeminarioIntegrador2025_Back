import { Module } from '@nestjs/common';
import { PosicionService } from './posicion.service';
import { PosicionController } from './posicion.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PosicionController],
  providers: [PosicionService],
  exports: [PosicionService],
})
export class PosicionModule {}
