import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto';

@Controller('ubicacion')
export class UbicacionController {
  constructor(private readonly ubicacionService: UbicacionService) {}

  @Post()
  create(@Body() createUbicacionDto: CreateUbicacionDto) {
    return this.ubicacionService.create(createUbicacionDto);
  }

  @Get()
  findAll() {
    return this.ubicacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ubicacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUbicacionDto: UpdateUbicacionDto) {
    return this.ubicacionService.update(+id, updateUbicacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ubicacionService.remove(+id);
  }
}
