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
import { Comprador } from 'src/comprador/entities/comprador.entity';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import { StrategyFactory } from '../strategy/strategy.factory';
import { IRegister } from '../strategy/interfaces/IRegister.interface';

@Injectable()
export class AuthService {
  public comprador: Comprador;
  public empresa: Empresa;
  public estrategia: IRegister;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private strFactory: StrategyFactory,
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
    const isMatch = await bcrypt.compare(loginDto.contrasena, user.contrasena);
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

  async registerUser(registerDto: CreateUserDto) {
    const { mail, contrasena: contrasena, rol } = registerDto;
    this.estrategia = this.strFactory.getStrategy(rol!.toString());
    await this.estrategia.registerUser(registerDto);
    const postValuesValidate = {
      mail,
      contrasena,
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
