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
    // Validar si los IDs de estado y empresa existen
    const estadoExists = await this.prisma.estado.findUnique({
      where: { id: createSucursalDto.estadoId },
    });
    const empresaExists = await this.prisma.empresa.findUnique({
      where: { id: createSucursalDto.empresaId },
    });

    const empresaUnique = await this.prisma.sucursal.findUnique({
      where: { empresaId: createSucursalDto.empresaId },
    });

    if (empresaUnique) {
      throw new HttpException(
        `La empresa ${empresaUnique.nombre} ya está asociada a otra sucursal.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!estadoExists) {
      throw new HttpException(
        `El estado con ID ${createSucursalDto.estadoId} no existe.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!empresaExists) {
      throw new HttpException(
        `La empresa con ID ${createSucursalDto.empresaId} no existe.`,
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
        empresa: { select: { id: true, nombre: true } },
        estado: { select: { id: true, nombre: true } },
        ubicacion: {
          select: { id: true, altura: true, calle: true, nombre: true },
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
        empresa: { select: { id: true, nombre: true } },
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
