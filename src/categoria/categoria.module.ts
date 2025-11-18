import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductoService } from 'src/producto/producto.service';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, PrismaService, ProductoService],
})
export class CategoriaModule {}
