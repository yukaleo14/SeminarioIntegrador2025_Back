import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoGateway } from './pedido.gateway';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService, private readonly pedidoGateway: PedidoGateway) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(+id, updatePedidoDto);
  }

  @Patch(':id/estado')
  async actualizarEstado(@Param('id') id: number, @Body('estado') nuevoEstado: string) {
    const pedidoActualizado = await this.pedidoService.actualizarEstado(id, nuevoEstado);

    // Notificamos vía WebSocket DESPUÉS de guardar en la BD
    if (pedidoActualizado.empresaId) {
      this.pedidoGateway.notifyPedidoActualizado(
        pedidoActualizado.empresaId,
        pedidoActualizado
      );
    }

    return pedidoActualizado;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoService.remove(+id);
  }
}
