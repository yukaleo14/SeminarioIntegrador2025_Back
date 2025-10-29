import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiOperation } from '@nestjs/swagger';

@Injectable()
export class SucursalService {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva sucursal' })
  async create(createSucursalDto: CreateSucursalDto) {
    // Validar si los IDs de estado y usuario existen
    const estadoExists = await this.prisma.estado.findUnique({
      where: { id: createSucursalDto.estadoId },
    });
    const userExists = await this.prisma.usuario.findUnique({
      where: { id: createSucursalDto.usuarioId },
    });

    const userUnique = await this.prisma.sucursal.findUnique({
      where: { usuarioId: createSucursalDto.usuarioId },
    });

    if (userUnique) {
      throw new HttpException(
        `El usuario ${userUnique.nombre} ya está asociado a otra sucursal.`,
        HttpStatus.BAD_REQUEST,
      );
    }

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
        OR: [{ nombre: createSucursalDto.nombre }],
      },
    });

    // realizo un try catch para manejar errores inesperados
    try {
      // Crear la sucursal
      const newSucursal = await this.prisma.sucursal.create({
        data: createSucursalDto,
      });
      return `Sucursal creada correctamente: ${newSucursal.nombre}`;
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
        descripcion: true,
        usuario: { select: { id: true, nombre: true } },
        estado: { select: { id: true, nombre: true } },
        ubicacion: {
          select: { id: true, coordenadaX: true, coordenadaY: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const sucursal = await this.prisma.sucursal.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        usuario: { select: { id: true, nombre: true } },
        estado: { select: { id: true, nombre: true } },
      },
    });
    if (!sucursal) {
      throw new HttpException('Sucursal no encontrada', HttpStatus.NOT_FOUND);
    }
    return sucursal;
  }

  async update(id: number, updateSucursalDto: UpdateSucursalDto) {
    await this.findOne(id);
    await this.prisma.sucursal.update({
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
