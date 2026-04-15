import { IRegister } from '../interfaces/IRegister.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';
import { EmpresaService } from '../../empresa/empresa.service';

@Injectable()
export default class EmpresaStrategy implements IRegister {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private empresaSvc: EmpresaService,
  ) {}
  async registerUser(registerDto: CreateUserDto): Promise<any> {
    const { nombre, cuitCuil, imagenPerfil } = registerDto;
    try {
      await this.prisma.$transaction(async (tx) => {
        // Crear el usuario primero y luego lo asignamos al comprador
        const usuario = await this.userService.create(registerDto, tx);
        await this.empresaSvc.create(
          {
            nombre,
            cuitCuil,
            imagenPerfil: imagenPerfil ?? '',
            usuarioId: usuario.id,
          },
          tx,
        );
      });
    } catch (error: any) {
      throw new HttpException(
        'No se pudo crear la empresa. ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async buscarNombre(id: number): Promise<any> {
    return await this.empresaSvc.getEmpresaByUserId(id);
  }
}
