import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompradorDto } from './dto/create-comprador.dto';
import { UpdateCompradorDto } from './dto/update-comprador.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompradorService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCompradorDto: CreateCompradorDto,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx ?? this.prisma;
    const dniDup = await this.prisma.comprador.findUnique({
      where: { dni: createCompradorDto.dni },
    });

    const phoneDup = await this.prisma.comprador.findUnique({
      where: { telefono: createCompradorDto.telefono },
    });

    const cuilDup = await this.prisma.comprador.findUnique({
      where: { cuitCuil: createCompradorDto.cuitCuil },
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

    await prisma.comprador.create({
      data: {
        nombre: createCompradorDto.nombre,
        apellido: createCompradorDto.apellido,
        cuitCuil: createCompradorDto.cuitCuil,
        dni: createCompradorDto.dni,
        telefono: createCompradorDto.telefono,
        imagenPerfil: createCompradorDto.imagenPerfil ?? '',
        ubicacionId: createCompradorDto.ubicacionId,
        usuarioId: createCompradorDto.usuarioId,
      },
    });
    return 'Comprador creado correctamente';
  }

  async findAll() {
    return await this.prisma.comprador.findMany({
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cuitCuil: true,
        dni: true,
        telefono: true,
        imagenPerfil: true,
        usuario: {
          select: {
            id: true,
            mail: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const comprador = await this.prisma.comprador.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cuitCuil: true,
        dni: true,
        telefono: true,
        imagenPerfil: true,
        usuario: {
          select: {
            id: true,
            mail: true,
          },
        },
      },
    });

    if (!comprador) {
      throw new HttpException('Comprador no encontrado', HttpStatus.NOT_FOUND);
    }
    return comprador;
  }

  async update(id: number, updateCompradorDto: UpdateCompradorDto) {
    await this.findOne(id);
    await this.prisma.comprador.update({
      where: { id },
      data: {
        nombre: updateCompradorDto.nombre,
        apellido: updateCompradorDto.apellido,
        cuitCuil: updateCompradorDto.cuitCuil,
        dni: updateCompradorDto.dni,
        telefono: updateCompradorDto.telefono,
        imagenPerfil: updateCompradorDto.imagenPerfil ?? '',
      },
    });
    return 'Comprador actualizado correctamente';
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.comprador.delete({
      where: { id },
    });
    return 'Comprador eliminado correctamente';
  }
}
