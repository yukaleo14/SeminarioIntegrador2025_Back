import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      // Validar que los productos existan (opcional, pero recomendado)
      if (createCategoriaDto.productoIds && createCategoriaDto.productoIds.length > 0) {
        for (const productoId of createCategoriaDto.productoIds) {
          const producto = await this.prisma.producto.findUnique({
            where: { id: Number(productoId) },
          });
          if (!producto) {
            throw new Error(`El producto con ID ${productoId} no existe`);
          }
        }
      }

      // Crear la categoría y conectar los productos existentes
      const newCategoria = await this.prisma.categoria.create({
        data: {
          nombre: createCategoriaDto.nombre,
          fechaHora: createCategoriaDto.fechaHora,
          productos: createCategoriaDto.productoIds
            ? {
                connect: createCategoriaDto.productoIds.map((id) => ({
                  id: Number(id),
                })),
              }
            : undefined,
        },
        include: {
          productos: true,
        },
      });

      return newCategoria;
    } catch (error) {
      //throw new Error(`Error al crear la categoría: ${error.message}`);
    }
  }

  async findAll() {
    return await this.prisma.categoria.findMany();
  }

  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!categoria) {
      throw new HttpException('Categoria no encontrada', HttpStatus.NOT_FOUND);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    await this.findOne(id);
    await this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
    return `Categoria actualizada correctamente`;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.categoria.delete({
      where: { id },
    });
    return `Categoria eliminada correctamente`;
  }
}
