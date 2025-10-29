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
        sucarsal: {
          connect: { id: Number(createProductoDto.sucursalId) },
        },
      },
      include: { categoria: true, estado: true, sucarsal: true},
    });
    return 'This action adds a new producto';
  }

  findAllBySucursal(sucursalId: number) {
    return this.prisma.producto.findMany({
      where: {
        sucursalId: sucursalId,
      },
      include: {
        categoria: true,
        estado: true,
      },
    });
  }

  findAll() {
    return this.prisma.producto.findMany({
      select: {
        id: true,
        nombre: true,
        precioUnidad: true,
        categoria: {
          select: {
            nombre: true,
          },
        },
        estado: {
          select: {
            nombre: true,
          },
        },
        sucursal: {
          select: {
            nombre: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: {
        id: id,
      },select: {
        nombre: true,
        precioUnidad: true,
        categoria: {
          select: {
            nombre: true,
          },
        },
        estado: {
          select: {
            nombre: true,
          },
        },
        sucursal: {
          select: {
            nombre: true,
          },
        },
      },
    })
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    await this.findOne(id);
    await this.prisma.producto.update({
      where: { id },
      data: {
        nombre: updateProductoDto.nombre,
        precioUnidad: updateProductoDto.precioUnidad,
        categoria: {
          connect: { id: Number(updateProductoDto.categoriaId) },
        },
        estado: {
          connect: { id: Number(updateProductoDto.estadoId) },
        },
      },
    });
    return 'producto actualizado';

  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
