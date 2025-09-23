import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const userToken = await this.authService.validateUser(loginDto);
    return userToken;
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: CreateUserDto) {
    const userToken = await this.authService.registerUser(registerDto);
    return userToken;
  }
}
