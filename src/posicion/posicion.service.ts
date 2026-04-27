import { Injectable } from '@nestjs/common';
import { CreatePosicionDto } from './dto/create-posicion.dto';
import { UpdatePosicionDto } from './dto/update-posicion.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PosicionService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPosicionDto: CreatePosicionDto, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prisma;
    return prisma.posicion.create({
      data: createPosicionDto,
    });
  }

  findAll() {
    return this.prisma.posicion.findMany();
  }

  findOne(id: number) {
    return this.prisma.posicion.findUnique({
      where: { id },
    });
  }

  findByCoordinates(coordenadaX: number, coordenadaY: number) {
    return this.prisma.posicion.findFirst({
      where: { coordenadaX, coordenadaY },
    });
  }

  update(id: number, updatePosicionDto: UpdatePosicionDto) {
    return this.prisma.posicion.update({
      where: { id },
      data: updatePosicionDto,
    });
  }

  remove(id: number) {
    return this.prisma.posicion.delete({
      where: { id },
    });
  }
}
