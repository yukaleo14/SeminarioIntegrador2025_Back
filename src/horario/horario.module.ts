import { Module } from '@nestjs/common';
import { HorarioService } from './horario.service';
import { HorarioController } from './horario.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HorarioController],
  providers: [HorarioService, PrismaService],
})
export class HorarioModule {}
