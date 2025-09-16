import { LoginDto } from './dto/login-dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
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
    // Contraseña correcta
    if (user.contraseña === loginDto.contraseña) {
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
}
