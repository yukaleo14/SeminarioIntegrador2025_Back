import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '@prisma/client';

type UserWithoutPassword = Omit<UserEntity, 'password'>;

export class UserEntity implements UserWithoutPassword {
  @ApiProperty()
  id: number;
  @ApiProperty()
  mail: string;
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  apellido: string;
  @ApiProperty()
  telefono: string;
  @ApiProperty()
  dni: string;
  @ApiProperty()
  fechaHora: Date;
  @ApiProperty()
  cuit: string;
  @ApiProperty()
  rol: Rol;
}
