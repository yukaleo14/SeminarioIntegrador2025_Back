import { Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService) {}
  async create(createProductoDto: CreateProductoDto) {
    const estadoPorDefecto = await this.prisma.estado.findFirst({
      where: {
        ambito: 'PRODUCTO',
        nombre: 'CREADO',
      },
    });
    createProductoDto.estadoId = estadoPorDefecto!.id;
    await this.prisma.producto.create({ data: createProductoDto });
    return 'Producto creado correctamente';
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

  async findAllByCategoria(categoriaId: number) {
    return await this.prisma.producto.findMany({
      where: {
        categoriaId: categoriaId,
      },
      select: {
        id: true,
        nombre: true,
        precio: true,
        imagen: true,
        descripcion: true,
        sucursalId: true,
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
        imagen: true,
        tiempoPreparacionEstimado: true,
        descripcion: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
        estado: {
          select: {
            id: true,
            nombre: true,
          },
        },
        sucursal: {
          select: {
            id: true,
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
