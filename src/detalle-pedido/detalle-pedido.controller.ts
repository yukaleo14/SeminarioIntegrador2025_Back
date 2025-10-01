import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallePedidoService } from './detalle-pedido.service';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';

@Controller('detalle-pedido')
export class DetallePedidoController {
  constructor(private readonly detallePedidoService: DetallePedidoService) {}

  @Post()
  create(@Body() createDetallePedidoDto: CreateDetallePedidoDto) {
    return this.detallePedidoService.create(createDetallePedidoDto);
  }

  @Get()
  findAll() {
    return this.detallePedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallePedidoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallePedidoDto: UpdateDetallePedidoDto) {
    return this.detallePedidoService.update(+id, updateDetallePedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallePedidoService.remove(+id);
  }
}
