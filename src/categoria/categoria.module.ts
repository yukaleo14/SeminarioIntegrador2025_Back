import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductoModule } from '../producto/producto.module';

@Module({
  imports: [PrismaModule, ProductoModule],
  controllers: [CategoriaController],
  providers: [CategoriaService],
})
export class CategoriaModule {}
