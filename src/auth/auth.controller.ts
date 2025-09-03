import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const userToken = await this.authService.validateUser(loginDto);

    if (!userToken)
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);

    return userToken;
  }
}
