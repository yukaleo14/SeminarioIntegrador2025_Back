import { LoginDto } from './dto/login-dto';
import { Injectable } from '@nestjs/common';
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
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    // Usuario no encontrado
    if (!user) return null;

    // Contraseña correcta
    if (user.password === loginDto.password) {
      return this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    }
  }
}
