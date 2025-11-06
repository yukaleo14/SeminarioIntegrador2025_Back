import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PosicionService } from './posicion.service';
import { CreatePosicionDto } from './dto/create-posicion.dto';
import { UpdatePosicionDto } from './dto/update-posicion.dto';

@Controller('posicion')
export class PosicionController {
  constructor(private readonly posicionService: PosicionService) {}

  @Post()
  create(@Body() createPosicionDto: CreatePosicionDto) {
    return this.posicionService.create(createPosicionDto);
  }

  @Get()
  findAll() {
    return this.posicionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posicionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePosicionDto: UpdatePosicionDto) {
    return this.posicionService.update(+id, updatePosicionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posicionService.remove(+id);
  }
}
