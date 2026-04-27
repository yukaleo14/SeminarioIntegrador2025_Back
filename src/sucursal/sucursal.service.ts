import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Posicion } from 'src/posicion/entities/posicion.entity';
import { PosicionService } from 'src/posicion/posicion.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductoService } from 'src/producto/producto.service';
import { Ubicacion } from 'src/ubicacion/entities/ubicacion.entity';
import { UbicacionService } from 'src/ubicacion/ubicacion.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Injectable()
export class SucursalService {
  constructor(
    private prisma: PrismaService,
    private posicionSvc: PosicionService,
    private ubicacionSvc: UbicacionService,
    private productoSvc: ProductoService,
  ) {}

  async createSucursal(createSucursalDto: CreateSucursalDto) {
    let ubi: Ubicacion;
    let pos: Posicion;
    const {
      nombre,
      imagen,
      descripcion,
      empresaId,
      altura = '',
      calle = '',
      nombreUbicacion = '',
      coordenadaX = 0,
      coordenadaY = 0,
    } = createSucursalDto;

    const estadoPorDefecto = await this.prisma.estado.findFirst({
      where: {
        ambito: 'SUCURSAL',
        nombre: 'ABIERTO',
      },
    });

    const posicionDup = await this.posicionSvc.findByCoordinates(
      coordenadaX,
      coordenadaY,
    );
    if (posicionDup) {
      ubi = await this.ubicacionSvc.findByPosicionId(posicionDup.id);
      return await this.create({
        nombre,
        imagen,
        descripcion,
        estadoId: estadoPorDefecto!.id,
        empresaId,
        ubicacionId: ubi.id,
      });
    } else {
      pos = await this.posicionSvc.create({
        coordenadaX,
        coordenadaY,
      });
      ubi = await this.ubicacionSvc.create({
        calle,
        nombre: nombreUbicacion,
        altura,
        posicionId: pos.id,
      });
      return await this.create({
        nombre,
        imagen,
        descripcion,
        estadoId: estadoPorDefecto!.id,
        empresaId,
        ubicacionId: ubi.id,
      });
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva sucursal' })
  async create(createSucursalDto: CreateSucursalDto) {
    const { nombre, imagen, descripcion, estadoId, empresaId, ubicacionId } =
      createSucursalDto;
    const empresaExists = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    const empresaUnique = await this.prisma.sucursal.findUnique({
      where: { empresaId: empresaId },
    });

    // Verificar duplicados en name o address con una sola consulta
    const existingSucursal = await this.prisma.sucursal.findFirst({
      where: {
        OR: [{ nombre: nombre }],
      },
    });

    if (existingSucursal) {
      throw new HttpException('La Sucursal ya existe', HttpStatus.BAD_REQUEST);
    }

    if (empresaUnique) {
      throw new HttpException(
        `La empresa ya está asociada a otra sucursal.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!empresaExists) {
      throw new HttpException(
        `La empresa con ID ${empresaId} no existe.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // realizo un try catch para manejar errores inesperados
    try {
      // Crear la sucursal
      const newSucursal = await this.prisma.sucursal.create({
        data: {
          nombre,
          imagen,
          descripcion,
          empresaId,
          ubicacionId,
          estadoId,
        },
      });
      return `Sucursal creada correctamente: ${newSucursal.nombre}`;
    } catch (error: any) {
      throw new HttpException(
        'Error al crear la sucursal. Por favor, intenta nuevamente.' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findSucursalesByCategoria(categoriaId: number) {
    const productos = await this.productoSvc.findAllByCategoria(categoriaId);
    const sucursalesId = new Set<number>();
    productos.forEach((prod) => {
      sucursalesId.add(prod.sucursalId);
    });
    return await this.prisma.sucursal.findMany({
      where: {
        id: {
          in: Array.from(sucursalesId),
        },
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        empresa: { select: { id: true, nombre: true, imagenPerfil: true } },
        estado: { select: { id: true, nombre: true } },
        imagen: true,
        ubicacion: {
          select: {
            id: true,
            altura: true,
            calle: true,
            nombre: true,
            posicion: {
              select: {
                id: true,
                coordenadaX: true,
                coordenadaY: true,
              },
            },
          },
        },
      },
    });
  }

  async cambiarEstadoSucursal(id: number) {
    const sucursal = await this.findOne(id);
    const sucu = {
      estadoId: 0,
    };
    const abierto = await this.prisma.estado.findFirst({
      where: {
        ambito: 'SUCURSAL',
        nombre: 'ABIERTO',
      },
    });
    const cerrado = await this.prisma.estado.findFirst({
      where: {
        ambito: 'SUCURSAL',
        nombre: 'CERRADO',
      },
    });
    if (sucursal.estado.nombre === 'ABIERTO') {
      sucu.estadoId = cerrado!.id;
    } else {
      sucu.estadoId = abierto!.id;
    }
    return await this.update(id, sucu);
  }

  findAll() {
    return this.prisma.sucursal.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        empresa: { select: { id: true, nombre: true, imagenPerfil: true } },
        estado: { select: { id: true, nombre: true } },
        imagen: true,
        ubicacion: {
          select: {
            id: true,
            altura: true,
            calle: true,
            nombre: true,
            posicion: {
              select: {
                id: true,
                coordenadaX: true,
                coordenadaY: true,
              },
            },
          },
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
        empresa: { select: { id: true, nombre: true, imagenPerfil: true } },
        estado: { select: { id: true, nombre: true } },
        imagen: true,
        ubicacion: {
          select: {
            id: true,
            altura: true,
            calle: true,
            nombre: true,
            posicion: {
              select: {
                id: true,
                coordenadaX: true,
                coordenadaY: true,
              },
            },
          },
        },
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
