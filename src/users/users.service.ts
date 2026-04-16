import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from './../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prisma;
    const emailDup = await prisma.usuario.findUnique({
      where: { mail: createUserDto.mail },
    });
    if (emailDup) {
      throw new HttpException(
        'No se pudo crear el usuario. Verifica los datos e intenta nuevamente.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const password = createUserDto.contrasena;
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return await prisma.usuario.create({
      data: {
        mail: createUserDto.mail,
        contrasena: hash,
        rol: createUserDto.rol,
      },
    });
  }

  /**
   * Obtiene una lista de todos los usuarios sin incluir las contraseñas.
   * @returns Lista de usuarios sin contraseñas
   */
  findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        mail: true,
        rol: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        mail: true,
        rol: true,
        empresa: {
          select: {
            id: true,
            nombre: true,
            cuitCuil: true,
            imagenPerfil: true,
            sucursal: {
              select: {
                id: true,
                estadoId: true,
                descripcion: true,
                imagen: true,
                nombre: true,
              },
            },
          },
        },
        comprador: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            dni: true,
            telefono: true,
            imagenPerfil: true,
            ubicacion: {
              select: {
                id: true,
                nombre: true,
                calle: true,
                altura: true,
              },
            },
          },
        },
        repartidor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            cuitCuil: true,
            dni: true,
            telefono: true,
            imagenPerfil: true,
          },
        },
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    await this.prisma.usuario.update({
      where: { id },
      data: updateUserDto,
    });
    return 'Usuario actualizado correctamente';
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.usuario.delete({
      where: { id },
    });
    return 'Usuario eliminado correctamente';
  }
}
