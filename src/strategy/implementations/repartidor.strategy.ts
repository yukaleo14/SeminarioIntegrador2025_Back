import { IRegister } from '../interfaces/IRegister.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';
import { RepartidorService } from '../../repartidor/repartidor.service';

@Injectable()
export default class RepartidorStrategy implements IRegister {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private repartidorSvc: RepartidorService,
  ) {}
  async registerUser(registerDto: CreateUserDto): Promise<any> {
    const { nombre, apellido, telefono, cuitCuil, dni, imagenPerfil } =
      registerDto;
    try {
      await this.prisma.$transaction(async (tx) => {
        const usuario = await this.userService.create(registerDto, tx);
        await this.repartidorSvc.create(
          {
            nombre,
            apellido,
            cuitCuil,
            dni,
            telefono,
            imagenPerfil: imagenPerfil ?? '',
            usuarioId: usuario.id,
          },
          tx,
        );
      });
    } catch (error: any) {
      throw new HttpException(
        'No se pudo crear el repartidor. ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
