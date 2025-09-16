import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSucursalDto {
    
    @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ required: true })
  address: string;

  @ApiProperty()
  @IsInt()
  estadoId: number;

  @ApiProperty()
  @IsInt()
  userId: number;

}

