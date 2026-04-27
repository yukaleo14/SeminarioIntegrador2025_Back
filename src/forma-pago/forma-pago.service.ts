import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFormaPagoDto } from './dto/create-forma-pago.dto';
import { UpdateFormaPagoDto } from './dto/update-forma-pago.dto';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class FormaPagoService {
  constructor(private prisma: PrismaService) {}

  async create(createFormaPagoDto: CreateFormaPagoDto) {
    await this.prisma.formaPago.create({
      data: createFormaPagoDto,
    });
    return 'Forma de pago creado correctamente';
  }

  findAll() {
    return this.prisma.formaPago.findMany();
  }

  async findOne(id: number) {
    const formaPago = await this.prisma.formaPago.findUnique({
      where: { id },
    });

    if (!formaPago) {
      throw new HttpException('Forma de pago no existe', HttpStatus.NOT_FOUND);
    }
    return formaPago;
  }

  async update(id: number, updateFormaPagoDto: UpdateFormaPagoDto) {
    await this.findOne(id);
    await this.prisma.formaPago.update({
      where: { id },
      data: updateFormaPagoDto,
    });
    return `Forma de pago actualizado`;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.formaPago.delete({
      where: { id },
    });
    return `Forma de pago eliminado`;
  }
}
