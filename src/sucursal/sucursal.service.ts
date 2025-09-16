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
    const userExists = await this.prisma.user.findUnique({
      where: { id: createSucursalDto.userId },
    });

    if (!estadoExists) {
      throw new HttpException(
        `El estado con ID ${createSucursalDto.estadoId} no existe.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!userExists) {
      throw new HttpException(
        `El usuario con ID ${createSucursalDto.userId} no existe.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verificar duplicados en name o address con una sola consulta
    const existingSucursal = await this.prisma.sucursal.findFirst({
      where: {
        OR: [
          { name: createSucursalDto.name },
          { address: createSucursalDto.address },
        ],
      },
    });

    if (existingSucursal) {
      throw new HttpException(
        existingSucursal.name === createSucursalDto.name
          ? `Ya existe una sucursal con el nombre "${createSucursalDto.name}".`
          : `Ya existe una sucursal con la dirección "${createSucursalDto.address}".`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // realizo un try catch para manejar errores inesperados
    try {
      // Crear la sucursal
      const newSucursal = await this.prisma.sucursal.create({
        data: {
          name: createSucursalDto.name,
          address: createSucursalDto.address,
          estado: {
            connect: { id: createSucursalDto.estadoId },
          },
          user: {
            connect: { id: createSucursalDto.userId },
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
    return `This action returns all sucursal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sucursal`;
  }

  update(id: number, updateSucursalDto: UpdateSucursalDto) {
    return `This action updates a #${id} sucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursal`;
  }
}
