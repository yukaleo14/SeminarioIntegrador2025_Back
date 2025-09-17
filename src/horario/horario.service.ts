import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Horario } from '@prisma/client';

@Injectable()
export class HorarioService {
  constructor(private prisma: PrismaService) {}

  async create(createHorarioDto: CreateHorarioDto) : Promise<Horario> {
    try {
      const newHorario = await this.prisma.horario.create({
        data: {
          dia: createHorarioDto.dia,
          desde: createHorarioDto.desde,
          hasta: createHorarioDto.hasta,
          sucursal: {
            connect: { id: createHorarioDto.sucursalId } 
          }
        }, 
      });
      return newHorario;
    } catch (error) {
      console.error('Error creating horario:', error);
      throw error;
    }
  }

  findAll() {
    return this.prisma.horario.findMany({
      select: {
        id: true,
        dia: true,
        desde: true,
        hasta: true,
      }
    }
    );
  }

  async findOne(id: number) {
    const horario = await this.prisma.horario.findUnique({
      where: { id },
      select: {
        id: true,
        dia: true,
        desde: true,
        hasta: true,}
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
