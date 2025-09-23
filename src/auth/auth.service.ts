import { LoginDto } from './dto/login-dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

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
    console.log(user.contraseña, loginDto.contraseña, isMatch);
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
}
