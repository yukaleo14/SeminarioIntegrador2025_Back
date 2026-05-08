import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from './../prisma/prisma.service';
import { ApiOperation } from '@nestjs/swagger';
import { RutaService } from '../ruta/ruta.service';
import { Rol } from '@prisma/client';
import { Pedido } from './entities/pedido.entity';

@Injectable()
export class PedidoService {
  constructor(
    private prisma: PrismaService,
    private rutaService: RutaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  async create(createPedidoDto: CreatePedidoDto) {
    const estadoCreado = await this.prisma.estado.findFirst({
      where: { ambito: 'PEDIDO', nombre: 'CREADO' },
    });
    if (!estadoCreado) {
      throw new HttpException(
        'Estado PEDIDO/CREADO no encontrado en la base de datos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Auto-assign first available repartidor if not provided
    let repartidorId: number;
    if (createPedidoDto.repartidorId) {
      const repartidor = await this.prisma.repartidor.findUnique({
        where: { id: Number(createPedidoDto.repartidorId) },
      });
      if (!repartidor) {
        throw new HttpException(
          `Repartidor ID ${createPedidoDto.repartidorId} no existe`,
          HttpStatus.BAD_REQUEST,
        );
      }
      repartidorId = repartidor.id;
    } else {
      const primerRepartidor = await this.prisma.repartidor.findFirst();
      if (!primerRepartidor) {
        throw new HttpException(
          'No hay repartidores disponibles',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      repartidorId = primerRepartidor.id;
    }

    const companyExists = await this.prisma.empresa.findUnique({
      where: { id: Number(createPedidoDto.empresaId) },
    });
    const pagoExists = await this.prisma.pago.findUnique({
      where: { id: Number(createPedidoDto.pagoId) },
    });
    const usuarioExists = await this.prisma.usuario.findUnique({
      where: { id: Number(createPedidoDto.compradorId) },
    });

    if (!companyExists || !pagoExists || !usuarioExists) {
      throw new HttpException(
        `Algun ID de los relacionados no existe.
        Empresa ID: ${createPedidoDto.empresaId},
        Pago ID: ${createPedidoDto.pagoId},
        Comprador ID: ${createPedidoDto.compradorId}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existentePedido = await this.prisma.pedido.findFirst({
      where: { numero: String(createPedidoDto.numero) },
    });
    if (existentePedido) {
      throw new HttpException(
        `Ya existe un pedido con el numero ${createPedidoDto.numero}`,
        HttpStatus.CONFLICT,
      );
    }

    try {
      const rutaCreada = await this.rutaService.crearRuta(
        createPedidoDto.infoRuta,
      );
      return await this.prisma.pedido.create({
        data: {
          numero: createPedidoDto.numero,
          horaLlegadaEstimada: createPedidoDto.horaLlegadaEstimada,
          montoTotal: createPedidoDto.montoTotal,
          tiempoPreparacionEstimado: createPedidoDto.tiempoPreparacionEstimado,
          tiempoRepartoEstimado: createPedidoDto.tiempoRepartoEstimado,
          fechaHora: createPedidoDto.fechaHora,

          compradorId: Number(createPedidoDto.compradorId),
          repartidorId,
          empresaId: Number(createPedidoDto.empresaId),
          rutaId: rutaCreada.id,
          pagoId: Number(createPedidoDto.pagoId),
          estadoId: estadoCreado.id,

          detalle: {
            create: createPedidoDto.detalle.map((item) => ({
              cantidad: item.cantidad,
              montoSubtotal: item.montoSubtotal,
              producto: { connect: { id: item.productoId } },
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

  async actualizarEstado(
    pedidoId: number,
    nuevoEstadoNombre: string,
  ): Promise<Pedido> {
    const estado = await this.prisma.estado.findFirst({
      where: {
        nombre: nuevoEstadoNombre.toUpperCase().trim() as any,
        ambito: 'PEDIDO',
      },
    });
    if (!estado) {
      throw new HttpException(
        `Estado '${nuevoEstadoNombre}' no encontrado para pedidos`,
        HttpStatus.NOT_FOUND,
      );
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

  // Buscar si el usuario tiene pedidos asociados (sea como comprador, repartidor o empresa)
  async findUserPedidoByUserId(userId: number, rol: Rol): Promise<boolean> {
    let compradorPedidos: any = null;
    let repartidorPedidos: any = null;
    console.log('Buscando pedidos para usuarioId:', userId, 'con rol:', rol);
    if (rol === Rol.COMPRADOR) {
      compradorPedidos = await this.prisma.pedido.findFirst({
        where: { compradorId: userId },
      });
    }

    if (rol === Rol.REPARTIDOR) {
      repartidorPedidos = await this.prisma.pedido.findFirst({
        where: { repartidorId: userId },
      });
    }

    return !!(compradorPedidos || repartidorPedidos);
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
