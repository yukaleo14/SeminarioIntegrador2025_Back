import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const emailDup = await this.prisma.usuario.findUnique({
      where: { mail: createUserDto.mail },
    });
    const dniDup = await this.prisma.usuario.findUnique({
      where: { dni: createUserDto.dni },
    });
    const phoneDup = await this.prisma.usuario.findUnique({
      where: { telefono: createUserDto.telefono },
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
    const password = createUserDto.contraseña;
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    await this.prisma.usuario.create({
      data: {
        mail: createUserDto.mail,
        contraseña: hash,
        nombre: createUserDto.nombre,
        apellido: createUserDto.apellido,
        rol: createUserDto.rol,
        dni: createUserDto.dni,
        telefono: createUserDto.telefono,
        cuit: createUserDto.cuit ?? '',
      },
    });
    return 'Usuario creado correctamente';
  }

  /**
   * Obtiene una lista de todos los usuarios sin incluir las contraseñas.
   * @returns Lista de usuarios sin contraseñas
   */
  findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        mail: true,
        rol: true,
        dni: true,
        telefono: true,
        cuit: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        mail: true,
        rol: true,
        dni: true,
        telefono: true,
        cuit: true,
      },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getProfileFromPayload(payload: any) {
    const user = await this.prisma.usuario.findUnique({
      where: { mail: payload.mail },
      select: {
        nombre: true,
        mail: true,
        rol: true,
        dni: true,
        telefono: true,
        cuit: true,
      },
    });
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
