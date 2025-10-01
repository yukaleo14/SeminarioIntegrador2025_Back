import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoriaDto: CreateCategoriaDto) {
    await this.prisma.categoria.create({
      data: createCategoriaDto,
    });
    return 'Categoria creada correctamente';
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
