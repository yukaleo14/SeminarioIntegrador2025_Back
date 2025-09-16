import { Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PagoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPagoDto: CreatePagoDto) {
    const estadoPorDefecto = await this.prisma.estado.findFirst({
      where: {
        ambito: 'PAGO',
        nombre: 'PENDIENTE',
      },
    });

    if (!estadoPorDefecto) {
      return 'Estado por defecto no existe';
    }

    await this.prisma.pago.create({
      data: {
        numero: createPagoDto.numero,
        monto: createPagoDto.monto,
        fechaHora: createPagoDto.fechaHora,
        formaPago: {
          connect: { id: createPagoDto.formaPagoId },
        },
        estado: {
          connect: { id: estadoPorDefecto.id },
        },
      },
      include: { formaPago: true, estado: true },
    });
    return 'Pago creado correctamente';
  }

  async findAll() {
    const pagos = await this.prisma.pago.findMany({
      include: { formaPago: true, estado: true },
    });
    if (!pagos || pagos.length === 0) {
      return [];
    }
    return pagos;
  }

  async findOne(id: number) {
    const pago = await this.prisma.pago.findUnique({
      where: { id },
      include: { formaPago: true, estado: true },
    });
    return pago;
  }

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    await this.prisma.pago.update({
      where: { id },
      data: {
        numero: updatePagoDto.numero,
        monto: updatePagoDto.monto,
        fechaHora: updatePagoDto.fechaHora,
        formaPago: {
          connect: { id: updatePagoDto.formaPagoId },
        },
        estado: {
          connect: { id: updatePagoDto.estadoId },
        },
      },
      include: { formaPago: true, estado: true },
    });
    return 'Pago actualizado correctamente';
  }

  async remove(id: number) {
    await this.prisma.pago.delete({
      where: { id },
    });
    return 'Pago eliminado correctamente';
  }
}
