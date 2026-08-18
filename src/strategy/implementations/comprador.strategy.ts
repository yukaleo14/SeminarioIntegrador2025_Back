import { IRegister } from '../interfaces/IRegister.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Ubicacion } from '../../ubicacion/entities/ubicacion.entity';
import { Posicion } from '../../posicion/entities/posicion.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';
import { PosicionService } from '../../posicion/posicion.service';
import { UbicacionService } from '../../ubicacion/ubicacion.service';
import { CompradorService } from '../../comprador/comprador.service';

@Injectable()
export default class CompradorStrategy implements IRegister {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private posicionSvc: PosicionService,
    private ubicacionSvc: UbicacionService,
    private compradorSvc: CompradorService,
  ) {}
  async registerUser(registerDto: CreateUserDto): Promise<any> {
    const {
      coordenadaX,
      coordenadaY,
      calle,
      nombreUbicacion,
      altura,
      nombre,
      apellido,
      telefono,
      cuitCuil,
      dni,
      imagenPerfil,
    } = registerDto;
    try {
      await this.prisma.$transaction(async (tx) => {
        let ubi: Ubicacion;
        let pos: Posicion;
        // Crear el usuario primero y luego lo asignamos al comprador
        const usuario = await this.userService.create(registerDto, tx);
        const posicionDup = await this.posicionSvc.findByCoordinates(
          coordenadaX,
          coordenadaY,
        );
        if (posicionDup) {
          ubi = await this.ubicacionSvc.findByPosicionId(posicionDup.id);
        } else {
          // Crear posición y la asignamos a la ubicación
          pos = await this.posicionSvc.create(
            {
              coordenadaX,
              coordenadaY,
            },
            tx,
          );
          ubi = await this.ubicacionSvc.create(
            {
              calle,
              nombre: nombreUbicacion,
              altura,
              posicionId: pos.id,
            },
            tx,
          );
        }
        await this.compradorSvc.create(
          {
            nombre,
            apellido,
            telefono,
            cuitCuil,
            dni,
            imagenPerfil: imagenPerfil ?? '',
            ubicacionId: ubi.id,
            usuarioId: usuario.id,
          },
          tx,
        );
      });
    } catch (error: any) {
      throw new HttpException(
        'No se pudo crear el comprador. ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async buscarNombre(id: number): Promise<any> {
    return await this.compradorSvc.getCompradorByUserId(id);
  }

  async getPersonByUserId(id: number): Promise<any> {
    return await this.compradorSvc.getCompradorIdByUserId(id);
  }
}
