import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiOperation } from '@nestjs/swagger';

@Injectable()
export class PedidoService {
  constructor (private prisma: PrismaService) {}
  
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  async create(createPedidoDto: CreatePedidoDto) {
    const estadoExists = await this.prisma.estado.findUnique({
      where: { id: Number(createPedidoDto.estadoId) },
    });
    const deliveryExists = await this.prisma.estado.findUnique({
      where: { id: Number(createPedidoDto.deliveryId) },
    });
    const companyExists = await this.prisma.estado.findUnique({
      where: { id: Number(createPedidoDto.companyId) },
    });
    const rutaExists = await this.prisma.estado.findUnique({
      where: { id: Number(createPedidoDto.rutaId) },
    });
    const pagoExists = await this.prisma.estado.findUnique({
      where: { id: Number(createPedidoDto.pagoId) },
    });
    const usuarioExists = await this.prisma.estado.findUnique({
      where: { id: Number(createPedidoDto.usuarioId) },
    });
    
    if (!estadoExists || !deliveryExists || !companyExists || !rutaExists || !pagoExists || !usuarioExists) {
      throw new Error(`Algun ID de los relacionados no existe.
        Estado ID: ${createPedidoDto.estadoId},
        Delivery ID: ${createPedidoDto.deliveryId},
        Company ID: ${createPedidoDto.companyId},
        Ruta ID: ${createPedidoDto.rutaId},
        Pago ID: ${createPedidoDto.pagoId},
        Usuario ID: ${createPedidoDto.usuarioId}`);
    }

    const existentePedido = await this.prisma.pedido.findUnique({
      where: { numero: createPedidoDto.numero },
    });
    if (existentePedido) {
      throw new Error(`Ya existe un pedido con el numero ${createPedidoDto.numero}`);
    }
    
    try {
      const newPedido = await this.prisma.pedido.create({
        data: {
          numero: createPedidoDto.numero,
          horaLlegadaEstimada: createPedidoDto.horaLlegadaEstimada,
          montoTotal: createPedidoDto.montoTotal,
          tiempoPreparacionEstimado: createPedidoDto.tiempoPreparacionEstimado,
          tiempoRepartoEstimado: createPedidoDto.tiempoRepartoEstimado,
          fechaHora: createPedidoDto.fechaHora,
          usuarioId: Number(createPedidoDto.usuarioId),
          deliveryId: Number(createPedidoDto.deliveryId),
          companyId: Number(createPedidoDto.companyId),
          rutaId: Number(createPedidoDto.rutaId),
          pagoId: Number(createPedidoDto.pagoId),
          estadoId: Number(createPedidoDto.estadoId),
          
          // detalle pedido 

        }
    });
      return newPedido;
    } catch (error) {
      throw new HttpException(`Error al crear el pedido:`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return this.prisma.pedido.findMany({
      select: {
        id: true,
        numero: true,
        montoTotal: true,
        fechaHora: true,
        cliente: {select: {id: true, nombre: true}},
        delivery: {select: {id: true, nombre: true}},
        company: {select: {id: true, nombre: true}}
      }
    })
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: {id},
      select : {
        id: true,
        numero: true,
        montoTotal: true,
        fechaHora: true,
        cliente: {select: {id: true, nombre: true}},
        delivery: {select: {id: true, nombre: true}},
        company: {select: {id: true, nombre: true}}
      }
    })
    if (!pedido) {
      throw new HttpException('Pedido no encontrado', HttpStatus.NOT_FOUND)
    }
    return pedido
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    await this.findOne(id)
    // Convert string IDs to numbers if present
    const data: any = { ...updatePedidoDto };
    if (data.usuarioId !== undefined) data.usuarioId = Number(data.usuarioId);
    if (data.deliveryId !== undefined) data.deliveryId = Number(data.deliveryId);
    if (data.companyId !== undefined) data.companyId = Number(data.companyId);
    if (data.rutaId !== undefined) data.rutaId = Number(data.rutaId);
    if (data.pagoId !== undefined) data.pagoId = Number(data.pagoId);
    if (data.estadoId !== undefined) data.estadoId = Number(data.estadoId);
    await this.prisma.pedido.update({
      where: {id},
      data,
    })
    return 'Pedido actualizado correctamente'
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.pedido.delete({
      where: {id}
    });
    return 'Pedido eliminado correctamente';
  }
}
