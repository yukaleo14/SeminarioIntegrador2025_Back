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
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
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

  async registerUser(registerDto: CreateUserDto) {
    await this.userService.create(registerDto);
    const postValues = {
      mail: registerDto.mail,
      contraseña: registerDto.contraseña,
    };
    const userToken = await this.validateUser(postValues);

    return userToken;
  }

  getProfile(req: Request) {
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
      return this.userService.getProfileFromPayload(payload);
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
