import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmpresaService {
  constructor(private prisma: PrismaService) { }
  async create(
    createEmpresaDto: CreateEmpresaDto,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx ?? this.prisma;
    const nombreDup = await this.prisma.empresa.findFirst({
      where: { nombre: createEmpresaDto.nombre },
    });

    const cuilDup = await this.prisma.empresa.findFirst({
      where: { cuitCuil: createEmpresaDto.cuitCuil },
    });

    if (nombreDup) {
      throw new HttpException(
        'El nombre de la empresa ya está registrado',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (cuilDup) {
      throw new HttpException(
        'El CUIL de la empresa ya está registrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    await prisma.empresa.create({
      data: {
        nombre: createEmpresaDto.nombre,
        cuitCuil: createEmpresaDto.cuitCuil,
        imagenPerfil: createEmpresaDto.imagenPerfil ?? '',
        usuarioId: createEmpresaDto.usuarioId,
      },
    });
  }

  async findAll() {
    return await this.prisma.empresa.findMany();
  }

  findOne(id: number) {
    return this.prisma.empresa.findUnique({ where: { id } });
  }

  update(id: number, updateEmpresaDto: UpdateEmpresaDto) {
    return `This action updates a #${id} empresa`;
  }

  remove(id: number) {
    return `This action removes a #${id} empresa`;
  }

  // Buscar empresa en base al id del usuario
  async getEmpresaByUserId(usuarioId: number) {
    return this.prisma.empresa.findUnique({
      where: { usuarioId },
    });
  }

  async getEmpresaIdByUserId(usuarioId: number) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { usuarioId },
      select: { id: true },
    });
    if (!empresa) {
      throw new HttpException(
        'Empresa no encontrada para el usuario dado',
        HttpStatus.NOT_FOUND,
      );
    }
    return empresa?.id;
  }
}
