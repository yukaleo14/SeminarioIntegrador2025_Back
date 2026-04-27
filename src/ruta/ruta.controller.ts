import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RutaService } from './ruta.service';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

@Controller('ruta')
export class RutaController {
  constructor(private readonly rutaService: RutaService) {}

  @Post()
  @ApiOperation({ summary: 'Calcular y persistir una ruta desde OSRM' })
  create(@Body() dto: CreateRutaDto) {
    return this.rutaService.crearRuta(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutaService.findOne(+id);
  }


}
