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
import { CompradorService } from './comprador.service';
import { CreateCompradorDto } from './dto/create-comprador.dto';
import { UpdateCompradorDto } from './dto/update-comprador.dto';

@Controller('comprador')
export class CompradorController {
  constructor(private readonly compradorService: CompradorService) {}

  @Post()
  create(@Body() createCompradorDto: CreateCompradorDto) {
    return this.compradorService.create(createCompradorDto);
  }

  @Get()
  findAll() {
    return this.compradorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.compradorService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompradorDto: UpdateCompradorDto,
  ) {
    return this.compradorService.update(id, updateCompradorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.compradorService.remove(id);
  }
}
