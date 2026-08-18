import { CreateUserDto } from '../../users/dto/create-user.dto';

export interface IRegister {
  registerUser(registerDto: CreateUserDto): Promise<any>;
  buscarNombre(id: number): Promise<any>;
  getPersonByUserId(id: number): Promise<any>;
}
