import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class DetallePedidoService {
  constructor(private prisma: PrismaService) {}

  async create(createDetallePedidoDto: CreateDetallePedidoDto) {
    const pedidoExists = await this.prisma.pedido.findUnique({
      where: { id: createDetallePedidoDto.pedidoId },
    });
    const productoExists = await this.prisma.producto.findUnique({
      where: { id: createDetallePedidoDto.productoId },
    });
    if (!pedidoExists) {
      throw new Error(
        `El pedido con ID ${createDetallePedidoDto.pedidoId} no existe.`,
      );
    }
    if (!productoExists) {
      throw new Error(
        `El producto con ID ${createDetallePedidoDto.productoId} no existe.`,
      );
    }
    try {
      const newDetallePedido = await this.prisma.detalleDePedido.create({
        data: {
          cantidad: createDetallePedidoDto.cantidad,
          montoSubtotal: createDetallePedidoDto.montoSubtotal,
          fechaHora: createDetallePedidoDto.fechaHora,
          pedido: { connect: { id: createDetallePedidoDto.pedidoId } },
          producto: { connect: { id: createDetallePedidoDto.productoId } },
        },
        include: { pedido: true, producto: true },
      });
      return newDetallePedido;
    } catch (error) {
      throw new HttpException(
        'Error al crear el detalle de pedido. Por favor, intenta nuevamente.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return this.prisma.detalleDePedido.findMany({
      select: {
        id: true,
        cantidad: true,
        montoSubtotal: true,
        fechaHora: true,
        pedido: { select: { id: true, numero: true } },
        producto: { select: { id: true, nombre: true } },
      },
    });
  }

  async findOne(id: number) {
    const detallePedido = await this.prisma.detalleDePedido.findUnique({
      where: { id },
      select: {
        id: true,
        cantidad: true,
        montoSubtotal: true,
        fechaHora: true,
        pedido: { select: { id: true, numero: true } },
        producto: { select: { id: true, nombre: true } },
      },
    });
    if (!detallePedido) {
      throw new HttpException(
        'Detalle de pedido no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
    return detallePedido;
  }

  async update(id: number, updateDetallePedidoDto: UpdateDetallePedidoDto) {
    await this.findOne(id);
    await this.prisma.detalleDePedido.update({
      where: { id },
      data: updateDetallePedidoDto,
    });
    return 'Detalle de pedido actualizado correctamente';
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.detalleDePedido.delete({
      where: { id },
    });
    return 'Detalle de pedido eliminado correctamente';
  }
}
