import { LoginDto } from './dto/login-dto';
import { Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    return 'This action adds a new login';
  }

  findAll() {
    return `This action returns all logins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} login`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} login`;
  }

  remove(id: number) {
    return `This action removes a #${id} login`;
  }
}
