import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { Public } from './decorators/public.decorator';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const userToken = await this.authService.validateUser(loginDto);
    return { token: userToken };
  }

  // @Post('register')
  // @Public()
  // async register(@Body() registerDto: CreateUserDto) {
  //   const userToken = await this.authService.registerUser(registerDto);
  //   return { token: userToken };
  // }
  @Post('register')
  @Public()
  register(@Body() registerDto: CreateUserDto) {
    return this.authService.registerUser(registerDto);
  }
  @Get('profile')
  getProfile(@Req() req: Request) {
    return this.authService.getProfile(req);
  }
}
