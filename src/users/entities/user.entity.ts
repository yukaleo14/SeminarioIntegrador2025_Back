import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '@prisma/client';

type UserWithoutPassword = Omit<UserEntity, 'password'>;

export class UserEntity implements UserWithoutPassword {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  telephone: string;

  @ApiProperty()
  dni: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  rol: Rol;
}
