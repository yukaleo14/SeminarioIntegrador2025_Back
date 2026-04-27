import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Horario } from '@prisma/client';

@Injectable()
export class HorarioService {
  constructor(private prisma: PrismaService) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<string> {
    try {
      await this.prisma.horario.create({
        data: createHorarioDto,
      });
      return 'Horario Creado Correctamente';
    } catch (error) {
      console.error('Error al crear horario:', error);
      throw error;
    }
  }

  async findAllByIdSucursal(idSucursal: number) {
    return await this.prisma.horario.findMany({
      where: {
        sucursalId: idSucursal,
      },
      select: {
        id: true,
        dia: true,
        desde: true,
        hasta: true,
      },
    });
  }

  async findOne(id: number) {
    const horario = await this.prisma.horario.findUnique({
      where: { id },
      select: {
        id: true,
        dia: true,
        desde: true,
        hasta: true,
      },
    });
    if (!horario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return horario;
  }

  async update(id: number, updateHorarioDto: UpdateHorarioDto) {
    await this.findOne(id);
    await this.prisma.horario.update({
      where: { id },
      data: updateHorarioDto,
    });
    return 'Horario actualizado correctamente';
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.horario.delete({
      where: { id },
    });
    return 'Horario eliminado correctamente';
  }
}
