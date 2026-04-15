import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRepartidorDto } from './dto/create-repartidor.dto';
import { UpdateRepartidorDto } from './dto/update-repartidor.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RepartidorService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createRepartidorDto: CreateRepartidorDto,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx ?? this.prisma;
    const dniDup = await this.prisma.repartidor.findUnique({
      where: { dni: createRepartidorDto.dni },
    });

    const phoneDup = await this.prisma.repartidor.findUnique({
      where: { telefono: createRepartidorDto.telefono },
    });

    const cuilDup = await this.prisma.repartidor.findUnique({
      where: { cuitCuil: createRepartidorDto.cuitCuil },
    });

    if (dniDup) {
      throw new HttpException(
        'No se pudo crear el comprador. Verifica los datos e intenta nuevamente.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (phoneDup) {
      throw new HttpException(
        'El telefono ya esta registrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (cuilDup) {
      throw new HttpException(
        'El CUIT/CUIL ya esta registrado',
        HttpStatus.BAD_REQUEST,
      );
    }
    return prisma.repartidor.create({ data: createRepartidorDto });
  }

  findAll() {
    return `This action returns all repartidor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} repartidor`;
  }

  update(id: number, updateRepartidorDto: UpdateRepartidorDto) {
    return `This action updates a #${id} repartidor`;
  }

  remove(id: number) {
    return `This action removes a #${id} repartidor`;
  }

  // Buscar repartidor en base al id del usuario
  async getRepartidorByUserId(usuarioId: number) {
    return this.prisma.repartidor.findUnique({
      where: { usuarioId },
    });
  }
}
