import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Sucursal } from '@prisma/client';
import { ApiOperation } from '@nestjs/swagger';

@Injectable()
export class SucursalService {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva sucursal' })
  async create(createSucursalDto: CreateSucursalDto): Promise<Sucursal> {
    // Validar si los IDs de estado y usuario existen
    const estadoExists = await this.prisma.estado.findUnique({
      where: { id: createSucursalDto.estadoId },
    });
    const userExists = await this.prisma.usuario.findUnique({
      where: { id: createSucursalDto.usuarioId },
    });

    if (!estadoExists) {
      throw new HttpException(
        `El estado con ID ${createSucursalDto.estadoId} no existe.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!userExists) {
      throw new HttpException(
        `El usuario con ID ${createSucursalDto.usuarioId} no existe.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verificar duplicados en name o address con una sola consulta
    const existingSucursal = await this.prisma.sucursal.findFirst({
      where: {
        OR: [
          { nombre: createSucursalDto.nombre },
          { direccion: createSucursalDto.direccion },
        ],
      },
    });

    if (existingSucursal) {
      throw new HttpException(
        existingSucursal.nombre === createSucursalDto.nombre
          ? `Ya existe una sucursal con el nombre "${createSucursalDto.nombre}".`
          : `Ya existe una sucursal con la dirección "${createSucursalDto.direccion}".`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // realizo un try catch para manejar errores inesperados
    try {
      // Crear la sucursal
      const newSucursal = await this.prisma.sucursal.create({
        data: {
          nombre: createSucursalDto.nombre,
          direccion: createSucursalDto.direccion,
          estado: {
            connect: { id: createSucursalDto.estadoId },
          },
          usuario: {
            connect: { id: createSucursalDto.usuarioId },
          },
        },
      });

      return newSucursal;
    } catch (error) {
      throw new HttpException(
        'Error al crear la sucursal. Por favor, intenta nuevamente.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  findAll() {
    return this.prisma.sucursal.findMany({
      select: {
        id: true,
        nombre: true,
        direccion: true,
        usuario: { select: { id: true, nombre: true }},
        estado: { select: { id: true, nombre: true }},
      },
    });
  }

  async findOne(id: number) {
    const sucursal = await this.prisma.sucursal.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        direccion: true,
        usuario: { select: { id: true, nombre: true }},
        estado: { select: { id: true, nombre: true }},
      },
    });
    if (!sucursal) {
      throw new HttpException('Sucursal no encontrada', HttpStatus.NOT_FOUND);
    }
    return sucursal;
  }

  async update(id: number, updateSucursalDto: UpdateSucursalDto) {
    await this.findOne(id);
    await this.prisma.usuario.update({
      where: { id },
      data: updateSucursalDto,
    });
    return 'Sucursal actualizada correctamente';
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.sucursal.delete({
      where: { id },
    });
    return 'Sucursal eliminada correctamente';
  }
}
