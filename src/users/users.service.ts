import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const emailDup = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    const dniDup = await this.prisma.user.findUnique({
      where: { dni: createUserDto.dni },
    });
    const phoneDup = await this.prisma.user.findUnique({
      where: { telephone: createUserDto.telephone },
    });
    if (emailDup || dniDup) {
      throw new HttpException(
        'No se pudo crear el usuario. Verifica los datos e intenta nuevamente.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (phoneDup) {
      throw new HttpException(
        'El telefono ya esta registrado',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.user.create({
      data: createUserDto,
    });
    return 'Usuario creado correctamente';
  }

  /**
   * Obtiene una lista de todos los usuarios sin incluir las contraseñas.
   * @returns Lista de usuarios sin contraseñas
   */
  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        rol: true,
        dni: true,
        telephone: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        rol: true,
        dni: true,
        telephone: true,
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return 'Usuario actualizado correctamente';
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({
      where: { id },
    });
    return 'Usuario eliminado correctamente';
  }
}
