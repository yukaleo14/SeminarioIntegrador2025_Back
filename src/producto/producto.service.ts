import { Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService) {}
  async create(createProductoDto: CreateProductoDto) {
    await this.prisma.producto.create({
      data: {
        nombre: createProductoDto.nombre,
        precioUnidad: createProductoDto.precioUnidad,
        categoria: {
          connect: { id: Number(createProductoDto.categoriaId) },
        },
        estado: {
          connect: { id: Number(createProductoDto.estadoId) },
        },
      },
      include: { categoria: true, estado: true },
    });
    return 'This action adds a new producto';
  }

  findAll() {
    return `This action returns all producto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
