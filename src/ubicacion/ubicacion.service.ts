import { Injectable } from '@nestjs/common';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UbicacionService {
  constructor(private readonly prisma: PrismaService) {}
  create(
    createUbicacionDto: CreateUbicacionDto,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx ?? this.prisma;
    return prisma.ubicacion.create({
      data: createUbicacionDto,
    });
  }

  findAll() {
    return this.prisma.ubicacion.findMany();
  }

  findOne(id: number) {
    return this.prisma.ubicacion.findUnique({
      where: { id },
    });
  }

  findByPosicionId(posicionId: number) {
    return this.prisma.ubicacion.findFirstOrThrow({
      where: { posicionId },
    });
  }

  update(id: number, updateUbicacionDto: UpdateUbicacionDto) {
    return this.prisma.ubicacion.update({
      where: { id },
      data: updateUbicacionDto,
    });
  }

  remove(id: number) {
    return this.prisma.ubicacion.delete({
      where: { id },
    });
  }
}
