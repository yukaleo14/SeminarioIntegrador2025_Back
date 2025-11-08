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
        precio: createProductoDto.precio,
        imagen: createProductoDto.imagen,
        tiempoPreparacionEstimado: createProductoDto.tiempoPreparacionEstimado,
        descripcion: createProductoDto.descripcion,
        categoria: {
          connect: { id: Number(createProductoDto.categoriaId) },
        },
        estado: {
          connect: { id: Number(createProductoDto.estadoId) },
        },
        sucursal: {
          connect: { id: Number(createProductoDto.sucursalId) },
        },
      },
      include: { categoria: true, estado: true, sucursal: true },
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

  findAllBySucursalAndCategoria(sucursalId: number, categoriaId: number) {
    if (!sucursalId) return this.findAllByCategoria(categoriaId);
    if (!categoriaId) return this.findAllBySucursal(sucursalId);
    if (!sucursalId && !categoriaId)
      return this.prisma.producto.findMany({
        where: {
          sucursalId: sucursalId,
          categoriaId: categoriaId,
        },
        include: {
          categoria: true,
          estado: true,
        },
      });
  }

  findAllByCategoria(categoriaId: number) {
    return this.prisma.producto.findMany({
      where: {
        categoriaId: categoriaId,
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
        precio: true,
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
      },
      select: {
        nombre: true,
        precio: true,
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
        precio: updateProductoDto.precio,
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
