import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpresaService {
  constructor(private prisma: PrismaService) {}
  async create(createEmpresaDto: CreateEmpresaDto) {
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

    await this.prisma.empresa.create({
      data: {
        nombre: createEmpresaDto.nombre,
        cuitCuil: createEmpresaDto.cuitCuil,
        imagenPerfil: createEmpresaDto.imagenPerfil ?? '',
        usuarioId: createEmpresaDto.usuarioId,
      },
    });
  }

  findAll() {
    return `This action returns all empresa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} empresa`;
  }

  update(id: number, updateEmpresaDto: UpdateEmpresaDto) {
    return `This action updates a #${id} empresa`;
  }

  remove(id: number) {
    return `This action removes a #${id} empresa`;
  }
}
