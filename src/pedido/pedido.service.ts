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
    return `This action returns all pedido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pedido`;
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} pedido`;
  }
}
