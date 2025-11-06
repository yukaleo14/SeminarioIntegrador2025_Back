import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CreateEmpresaDto } from 'src/empresa/dto/create-empresa.dto';
import { CreateHorarioDto } from 'src/horario/dto/create-horario.dto';
import { CreateProductoDto } from 'src/producto/dto/create-producto.dto';

export class CreateSucursalDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ required: true })
  descripcion: string;

  @IsNotEmpty()
  @ApiProperty({ type: [CreateHorarioDto] })
  horario: CreateHorarioDto[];

  @IsNotEmpty()
  @ApiProperty({ required: true, type: CreateEmpresaDto })
  empresa: CreateEmpresaDto

  @IsNotEmpty()
  @ApiProperty({ type: [CreateProductoDto] })
  productos: CreateProductoDto[];

  @ApiProperty()
  @IsInt()
  ubicacionId: number;
  
  @ApiProperty()
  @IsInt()
  estadoId: number;
}
