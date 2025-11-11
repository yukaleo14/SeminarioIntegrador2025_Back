import { Module } from '@nestjs/common';
import { CompradorService } from './comprador.service';
import { CompradorController } from './comprador.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CompradorController],
  providers: [CompradorService, PrismaService],
})
export class CompradorModule {}
