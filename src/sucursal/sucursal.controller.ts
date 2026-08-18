import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { Public } from './../auth/decorators/public.decorator';

@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post()
  create(@Body() createSucursalDto: CreateSucursalDto) {
    return this.sucursalService.createSucursal(createSucursalDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.sucursalService.findAll();
  }

  @Get('categoria/:id')
  @Public()
  findAllByCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalService.findSucursalesByCategoria(id);
  }

  @Get('empresa/:id')
  findByEmpresa(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalService.findByEmpresa(id);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.sucursalService.findOne(+id);
  }

  @Patch('estado/:id')
  actualizarEstado(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalService.cambiarEstadoSucursal(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSucursalDto: UpdateSucursalDto,
  ) {
    return this.sucursalService.update(+id, updateSucursalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sucursalService.remove(+id);
  }
}
