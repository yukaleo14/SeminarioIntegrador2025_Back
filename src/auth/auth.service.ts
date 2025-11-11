import { LoginDto } from './dto/login-dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { CompradorService } from 'src/comprador/comprador.service';
import { EmpresaService } from 'src/empresa/empresa.service';
import { UbicacionService } from 'src/ubicacion/ubicacion.service';
import { PosicionService } from 'src/posicion/posicion.service';
import { Posicion } from 'src/posicion/entities/posicion.entity';
import { Ubicacion } from 'src/ubicacion/entities/ubicacion.entity';
import { Comprador } from 'src/comprador/entities/comprador.entity';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import { RepartidorService } from 'src/repartidor/repartidor.service';

@Injectable()
export class AuthService {
  public cliente: Comprador;
  public empresa: Empresa;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly compradorSvc: CompradorService,
    private readonly empresaSvc: EmpresaService,
    private readonly ubicacionSvc: UbicacionService,
    private readonly posicionSvc: PosicionService,
    private readonly repartidorSvc: RepartidorService,
  ) {}

  // Validar usuario y generar token JWT
  async validateUser(loginDto: LoginDto) {
    const user = await this.prisma.usuario.findUnique({
      where: { mail: loginDto.mail },
    });
    // Usuario no encontrado
    if (!user) {
      throw new HttpException(
        'Correo o contraseña incorrectos',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isMatch = await bcrypt.compare(loginDto.contraseña, user.contraseña);
    // Contraseña correcta
    if (isMatch) {
      return this.jwtService.sign({
        id: user.id,
        mail: user.mail,
        rol: user.rol,
      });
    } else {
      throw new HttpException(
        'Correo o contraseña incorrectos',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async crearCliente(registerDto: CreateUserDto) {
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

  public async crearEmpresa(registerDto: CreateUserDto) {
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

  public async crearRepartidor(registerDto: CreateUserDto) {
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

  async registerUser(registerDto: CreateUserDto) {
    const { mail, contraseña, rol } = registerDto;
    if (rol === 'CLIENTE') {
      await this.crearCliente(registerDto);
    }
    if (rol === 'EMPRESA') {
      await this.crearEmpresa(registerDto);
    }
    if (rol === 'REPARTIDOR') {
      await this.crearRepartidor(registerDto);
    }
    const postValuesValidate = {
      mail,
      contraseña,
    };
    const userToken = await this.validateUser(postValuesValidate);
    return userToken;
  }

  async getProfile(req: Request) {
    const authHeader = req.headers.authorization;

    // Validamos que el header exista y sea string
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Token no proporcionado');
    }

    // Extraemos el token después de "Bearer "
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const payload: object = this.jwtService.verify(token);
      const user = await this.userService.findOne(payload['id']);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
