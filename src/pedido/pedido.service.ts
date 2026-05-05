import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from './../prisma/prisma.service';
import { ApiOperation } from '@nestjs/swagger';
import { PedidoGateway } from '../websocket/pedido.gateway';
import { Pedido } from '@prisma/client';
import { RutaService } from '../ruta/ruta.service';
import { connect } from 'http2';

@Injectable()
export class PedidoService {
  constructor(
    private prisma: PrismaService,
    private rutaService: RutaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  async create(createPedidoDto: CreatePedidoDto) {
    const estadoExists = await this.prisma.estado.findUnique({
      where: { id: Number(createPedidoDto.estadoId) },
    });
    const deliveryExists = await this.prisma.repartidor.findUnique({
      where: { id: Number(createPedidoDto.repartidorId) },
    });
    const companyExists = await this.prisma.empresa.findUnique({
      where: { id: Number(createPedidoDto.empresaId) },
    });
    const rutaExists = await this.prisma.ruta.findUnique({
      where: { id: Number(createPedidoDto.rutaId) },
    });
    const pagoExists = await this.prisma.pago.findUnique({
      where: { id: Number(createPedidoDto.pagoId) },
    });
    const usuarioExists = await this.prisma.usuario.findUnique({
      where: { id: Number(createPedidoDto.compradorId) },
    });

    if (
      !estadoExists ||
      !deliveryExists ||
      !companyExists ||
      !rutaExists ||
      !pagoExists ||
      !usuarioExists
    ) {
      throw new Error(`Algun ID de los relacionados no existe.
        Estado ID: ${createPedidoDto.estadoId},
        Repartidor ID: ${createPedidoDto.repartidorId},
        Empresa ID: ${createPedidoDto.empresaId},
        Ruta ID: ${createPedidoDto.rutaId},
        Pago ID: ${createPedidoDto.pagoId},
        Comprador ID: ${createPedidoDto.compradorId}`);
    }

    const existentePedido = await this.prisma.pedido.findFirst({
      where: { numero: String(createPedidoDto.numero) },
    });
    if (existentePedido) {
      throw new Error(
        `Ya existe un pedido con el numero ${createPedidoDto.numero}`,
      );
    }

    

    try {
      const rutaCreada = await this.rutaService.crearRuta(createPedidoDto.infoRuta);
      return await this.prisma.pedido.create({
        data: {
          numero: createPedidoDto.numero,
          horaLlegadaEstimada: createPedidoDto.horaLlegadaEstimada,
          montoTotal: createPedidoDto.montoTotal,
          tiempoPreparacionEstimado: createPedidoDto.tiempoPreparacionEstimado,
          tiempoRepartoEstimado: createPedidoDto.tiempoRepartoEstimado,
          fechaHora: createPedidoDto.fechaHora,

          compradorId: Number(createPedidoDto.compradorId),
          repartidorId: Number(createPedidoDto.repartidorId),
          empresaId: Number(createPedidoDto.empresaId),
          rutaId: rutaCreada.id,
          pagoId: Number(createPedidoDto.pagoId),
          estadoId: Number(createPedidoDto.estadoId),

          detalle: {
            create: createPedidoDto.detalle.map((item) => ({
              cantidad: item.cantidad,
              montoSubtotal: item.montoSubtotal,
              producto: { connect: { id: item.productoId } }
            })),
          },
        },
        include: {
          ruta: true,
          detalle: true,
          
        }, 
      });

    } catch (error) {
      console.error('ERROR REAL AL CREAR PEDIDO:', error); // Esto te mostrará el error en la terminal
      throw new HttpException(
        `Error al crear el pedido:`, // Esto enviará el detalle a Angular
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return this.prisma.pedido.findMany({
      select: {
        id: true,
        numero: true,
        montoTotal: true,
        fechaHora: true,
        comprador: { select: { id: true, nombre: true } },
        repartidor: { select: { id: true, nombre: true } },
        empresa: { select: { id: true, nombre: true } },
      },
    });
  }

  findBySucursal(empresaId: number) {
    return this.prisma.pedido.findMany({
      where: { empresaId },
    });
  }
  
  async actualizarEstado(pedidoId: number, nuevoEstadoNombre: string): Promise<Pedido> {
    const estado = await this.prisma.estado.findFirst({
      where: {
        nombre: nuevoEstadoNombre.toUpperCase().trim() as any,
        ambito: 'PEDIDO',
      },
    });
    if (!estado) {
      throw new HttpException(`Estado '${nuevoEstadoNombre}' no encontrado para pedidos`, HttpStatus.NOT_FOUND);
    }

    const pedidoActualizado = await this.prisma.pedido.update({
      where: { id: pedidoId },
      data: { estadoId: estado.id },
      include: {
        estado: true,
        repartidor: true,
        empresa: true,
      },
    });

    return pedidoActualizado;
  }
  

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      select: {
        id: true,
        numero: true,
        montoTotal: true,
        fechaHora: true,
        comprador: { select: { id: true, nombre: true } },
        repartidor: { select: { id: true, nombre: true } },
        empresa: { select: { id: true, nombre: true } },
      },
    });
    if (!pedido) {
      throw new HttpException('Pedido no encontrado', HttpStatus.NOT_FOUND);
    }
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    await this.findOne(id);
    const postValues = {
      numero: updatePedidoDto.numero,
      horaLlegadaEstimada: updatePedidoDto.horaLlegadaEstimada,
      montoTotal: updatePedidoDto.montoTotal,
      tiempoPreparacionEstimado: updatePedidoDto.tiempoPreparacionEstimado,
      tiempoRepartoEstimado: updatePedidoDto.tiempoRepartoEstimado,
      fechaHora: updatePedidoDto.fechaHora,
      compradorId: Number(updatePedidoDto.compradorId),
      repartidorId: Number(updatePedidoDto.repartidorId),
      empresaId: Number(updatePedidoDto.empresaId),
      rutaId: Number(updatePedidoDto.rutaId),
      pagoId: Number(updatePedidoDto.pagoId),
      estadoId: Number(updatePedidoDto.estadoId),
    };
    await this.prisma.pedido.update({
      where: { id },
      data: postValues,
    });
    return 'Pedido actualizado correctamente';
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.pedido.delete({
      where: { id },
    });
    return 'Pedido eliminado correctamente';
  }
}
