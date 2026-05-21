import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    await this.prisma.producto.create({
      data: createProductoDto,
      include: {
        sucursal: {
          include: {
            ubicacion: {
              include: {
                posicion: true,
              },
            },
          },
        },
      },
    });
    return 'Producto creado correctamente';
  }

  findAllByEmpresa(empresaId: number) {
    return this.prisma.producto.findMany({
      where: { sucursal: { empresaId } },
      include: {
        categoria: true,
        estado: true,
        sucursal: { select: { id: true, nombre: true } },
      },
    });
  }

  async actualizarEstado(id: number, nombreEstado: string) {
    const nombreNormalizado = nombreEstado.toUpperCase().trim();
    const estado = await this.prisma.estado.findFirst({
      where: { ambito: 'PRODUCTO', nombre: nombreNormalizado as any },
    });
    if (!estado) {
      throw new HttpException(
        `Estado '${nombreEstado}' no encontrado para productos`,
        HttpStatus.NOT_FOUND,
      );
    }
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    return this.prisma.producto.update({
      where: { id },
      data: { estadoId: estado.id },
      include: { estado: true },
    });
  }

  findAllBySucursal(sucursalId: number) {
    return this.prisma.producto.findMany({
      where: {
        sucursalId: sucursalId,
      },
      include: {
        categoria: true,
        estado: true,
        sucursal: true,
      },
    });
  }

  findAllBySucursalAndCategoria(sucursalId: number, categoriaId: number) {
    if (!sucursalId) return this.findAllByCategoria(categoriaId);
    if (!categoriaId) return this.findAllBySucursal(sucursalId);
    return this.prisma.producto.findMany({
      where: {
        sucursalId: sucursalId,
        categoriaId: categoriaId,
      },
      include: {
        categoria: true,
        estado: true,
        sucursal: true,
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
        sucursal: true,
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
            empresaId: true,
            ubicacion: {
              select: {
                calle: true,
                altura: true,
                nombre: true,
                posicion: { select: { coordenadaX: true, coordenadaY: true } },
              },
            },
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
